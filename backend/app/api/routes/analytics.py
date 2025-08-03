from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Dict, Any, List
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime, timedelta
import logging

from app.core.database import get_db
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.models.chat import ChatMessage, ChatSession
from app.crud import chat as chat_crud

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/dashboard/{user_id}")
async def get_user_analytics_dashboard(
    user_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get comprehensive analytics dashboard data for a user
    Returns processed data with Plotly charts for visualization
    """
    
    # Security check: users can only access their own dashboard
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only view your own dashboard"
        )
    
    try:
        # Get all user messages with sentiment analysis
        user_messages = db.query(ChatMessage).join(ChatSession).filter(
            ChatSession.user_id == user_id,
            ChatMessage.is_from_user == "true",
            ChatMessage.sentiment_analyzed == "true"
        ).order_by(ChatMessage.timestamp.asc()).all()
        
        # Get basic statistics
        total_messages = len(user_messages)
        
        if total_messages == 0:
            return {
                "username": current_user.full_name or "User",
                "total_messages": 0,
                "average_sentiment": 0.0,
                "sentiment_trend_chart_json": _create_empty_trend_chart(),
                "mood_distribution_chart_json": _create_empty_mood_chart(),
                "message": "Henüz analiz edilecek mesaj bulunmuyor. NeetUp Spark ile sohbet etmeye başlayın!"
            }
        
        # Convert to pandas DataFrame for analysis
        df_data = []
        for msg in user_messages:
            df_data.append({
                'timestamp': msg.timestamp,
                'content': msg.content,
                'sentiment_label': msg.sentiment_label,
                'sentiment_score': msg.sentiment_score or 0.0,
                'date': msg.timestamp.date(),
                'hour': msg.timestamp.hour
            })
        
        df = pd.DataFrame(df_data)
        
        # Calculate statistics
        average_sentiment = float(df['sentiment_score'].mean())
        
        # Create Plotly charts (already return dict objects)
        sentiment_trend_chart = _create_sentiment_trend_chart(df)
        mood_distribution_chart = _create_mood_distribution_chart(df)
        activity_heatmap_chart = _create_activity_heatmap_chart(df)
        
        # Additional insights
        most_positive_day = df.groupby('date')['sentiment_score'].mean().idxmax()
        most_active_hour = int(df['hour'].mode().iloc[0]) if not df['hour'].mode().empty else 12
        
        # Recent sentiment trend (last 7 days)
        recent_df = df[df['timestamp'] >= (datetime.now() - timedelta(days=7))]
        recent_trend = "stable"
        if len(recent_df) > 1:
            recent_scores = recent_df['sentiment_score'].tolist()
            if recent_scores[-1] > recent_scores[0]:
                recent_trend = "improving"
            elif recent_scores[-1] < recent_scores[0]:
                recent_trend = "declining"
        
        return {
            "username": current_user.full_name or "User",
            "total_messages": int(total_messages),
            "average_sentiment": round(float(average_sentiment), 3),
            "sentiment_trend_chart_json": sentiment_trend_chart,
            "mood_distribution_chart_json": mood_distribution_chart,
            "activity_heatmap_chart_json": activity_heatmap_chart,
            "insights": {
                "most_positive_day": str(most_positive_day) if 'most_positive_day' in locals() else None,
                "most_active_hour": int(most_active_hour),
                "recent_trend": recent_trend,
                "days_active": int(df['date'].nunique()),
                "average_daily_messages": round(float(total_messages) / max(float(df['date'].nunique()), 1), 1)
            }
        }
        
    except Exception as e:
        logger.error(f"Error generating analytics dashboard: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Dashboard verilerini yüklerken bir hata oluştu"
        )


def _create_sentiment_trend_chart(df: pd.DataFrame) -> Dict[str, Any]:
    """Create sentiment trend over time chart using Plotly"""
    
    # Group by date and calculate daily average sentiment
    daily_sentiment = df.groupby('date')['sentiment_score'].agg(['mean', 'count']).reset_index()
    daily_sentiment.columns = ['date', 'avg_sentiment', 'message_count']
    
    # Create the line chart
    fig = go.Figure()
    
    # Add sentiment trend line
    fig.add_trace(go.Scatter(
        x=daily_sentiment['date'],
        y=daily_sentiment['avg_sentiment'],
        mode='lines+markers',
        name='Günlük Ortalama Duygu',
        line=dict(color='#8B5CF6', width=3),
        marker=dict(size=8, color='#8B5CF6'),
        hovertemplate='<b>%{x}</b><br>Duygu Skoru: %{y:.2f}<extra></extra>'
    ))
    
    # Add zero line for reference
    fig.add_hline(y=0, line_dash="dash", line_color="gray", opacity=0.5)
    
    # Update layout
    fig.update_layout(
        title={
            'text': 'Zaman İçinde Duygu Değişimi',
            'x': 0.5,
            'font': {'size': 18, 'color': '#1F2937'}
        },
        xaxis_title='Tarih',
        yaxis_title='Duygu Skoru (-1: Negatif, +1: Pozitif)',
        template='plotly_white',
        height=400,
        showlegend=False,
        hovermode='x unified'
    )
    
    # Convert to JSON and back to ensure numpy arrays are serialized
    import json
    return json.loads(fig.to_json())


def _create_mood_distribution_chart(df: pd.DataFrame) -> Dict[str, Any]:
    """Create mood distribution pie chart using Plotly"""
    
    # Count sentiment labels
    mood_counts = df['sentiment_label'].value_counts()
    
    # Define colors for different moods
    color_map = {
        'Pozitif': '#10B981',
        'Heyecanlı': '#F59E0B', 
        'Nötr': '#6B7280',
        'Endişeli': '#F97316',
        'Negatif': '#EF4444',
        'Kararsız': '#8B5CF6',
        'Motivasyonsuz': '#DC2626'
    }
    
    colors = [color_map.get(label, '#6B7280') for label in mood_counts.index]
    
    # Create pie chart
    fig = go.Figure(data=[go.Pie(
        labels=mood_counts.index,
        values=mood_counts.values,
        hole=0.4,  # Donut chart
        marker=dict(colors=colors, line=dict(color='#FFFFFF', width=2)),
        textinfo='label+percent',
        textposition='outside',
        hovertemplate='<b>%{label}</b><br>Mesaj Sayısı: %{value}<br>Oran: %{percent}<extra></extra>'
    )])
    
    fig.update_layout(
        title={
            'text': 'Duygu Durumu Dağılımı',
            'x': 0.5,
            'font': {'size': 18, 'color': '#1F2937'}
        },
        template='plotly_white',
        height=400,
        showlegend=True,
        legend=dict(
            orientation="v",
            yanchor="middle",
            y=0.5,
            xanchor="left",
            x=1.05
        )
    )
    
    # Convert to JSON and back to ensure numpy arrays are serialized
    import json
    return json.loads(fig.to_json())


def _create_activity_heatmap_chart(df: pd.DataFrame) -> Dict[str, Any]:
    """Create activity heatmap showing message frequency by hour and day"""
    
    if df.empty:
        # Return empty heatmap for no data
        day_order_tr = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
        empty_data = [[0 for _ in range(24)] for _ in range(7)]
        
        fig = go.Figure(data=go.Heatmap(
            z=empty_data,
            x=list(range(24)),
            y=day_order_tr,
            colorscale='Viridis',
            showscale=True,
            hoverongaps=False,
            hovertemplate='<b>%{y}</b><br>Saat: %{x}:00<br>Mesaj Sayısı: %{z}<extra></extra>'
        ))
    else:
        # Add day of week and hour
        df['day_of_week'] = df['timestamp'].dt.day_name()
        df['weekday_num'] = df['timestamp'].dt.dayofweek
        
        # Turkish day names mapping
        day_mapping = {
            'Monday': 'Pazartesi',
            'Tuesday': 'Salı', 
            'Wednesday': 'Çarşamba',
            'Thursday': 'Perşembe',
            'Friday': 'Cuma',
            'Saturday': 'Cumartesi',
            'Sunday': 'Pazar'
        }
        df['day_of_week_tr'] = df['day_of_week'].map(day_mapping)
        
        # Create hour-day heatmap data
        heatmap_data = df.groupby(['day_of_week_tr', 'hour']).size().reset_index(name='message_count')
        
        # Create complete grid (all days and hours)
        day_order_tr = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
        hours = list(range(24))
        
        # Initialize with zeros
        heatmap_matrix = [[0 for _ in range(24)] for _ in range(7)]
        
        # Fill with actual data
        for _, row in heatmap_data.iterrows():
            day_idx = day_order_tr.index(row['day_of_week_tr'])
            hour_idx = int(row['hour'])
            heatmap_matrix[day_idx][hour_idx] = int(row['message_count'])
        
        # Create heatmap
        fig = go.Figure(data=go.Heatmap(
            z=heatmap_matrix,
            x=hours,
            y=day_order_tr,
            colorscale='Viridis',
            showscale=True,
            hoverongaps=False,
            hovertemplate='<b>%{y}</b><br>Saat: %{x}:00<br>Mesaj Sayısı: %{z}<extra></extra>'
        ))
    
    fig.update_layout(
        title={
            'text': 'Günlük ve Saatlik Aktivite Haritası',
            'x': 0.5,
            'font': {'size': 16, 'color': '#1F2937'}
        },
        xaxis_title='Saat',
        yaxis_title='Gün',
        template='plotly_white',
        height=320,
        xaxis=dict(
            tickmode='linear',
            tick0=0,
            dtick=2
        )
    )
    
    # Convert to JSON and back to ensure numpy arrays are serialized
    import json
    return json.loads(fig.to_json())


def _create_empty_trend_chart() -> Dict[str, Any]:
    """Create empty trend chart for users with no data"""
    fig = go.Figure()
    fig.add_annotation(
        text="Henüz veri bulunmuyor<br>NeetUp Spark ile sohbet etmeye başlayın!",
        xref="paper", yref="paper",
        x=0.5, y=0.5, xanchor='center', yanchor='middle',
        showarrow=False,
        font=dict(size=16, color="gray")
    )
    fig.update_layout(
        title='Zaman İçinde Duygu Değişimi',
        template='plotly_white',
        height=400,
        xaxis=dict(showgrid=False, showticklabels=False),
        yaxis=dict(showgrid=False, showticklabels=False)
    )
    # Convert to JSON and back to ensure numpy arrays are serialized
    import json
    return json.loads(fig.to_json())


def _create_empty_mood_chart() -> Dict[str, Any]:
    """Create empty mood chart for users with no data"""
    fig = go.Figure()
    fig.add_annotation(
        text="Henüz veri bulunmuyor<br>NeetUp Spark ile sohbet etmeye başlayın!",
        xref="paper", yref="paper",
        x=0.5, y=0.5, xanchor='center', yanchor='middle',
        showarrow=False,
        font=dict(size=16, color="gray")
    )
    fig.update_layout(
        title='Duygu Durumu Dağılımı',
        template='plotly_white',
        height=400,
        xaxis=dict(showgrid=False, showticklabels=False),
        yaxis=dict(showgrid=False, showticklabels=False)
    )
    # Convert to JSON and back to ensure numpy arrays are serialized
    import json
    return json.loads(fig.to_json())


@router.get("/sentiment-history/{user_id}")
async def get_user_sentiment_history(
    user_id: str,
    limit: int = 50,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    """
    Get detailed sentiment history for a user
    Returns raw sentiment data for advanced analysis
    """
    
    # Security check
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only view your own data"
        )
    
    try:
        # Get recent messages with sentiment data
        messages = db.query(ChatMessage).join(ChatSession).filter(
            ChatSession.user_id == user_id,
            ChatMessage.is_from_user == "true",
            ChatMessage.sentiment_analyzed == "true"
        ).order_by(desc(ChatMessage.timestamp)).limit(limit).all()
        
        result = []
        for msg in messages:
            result.append({
                "id": msg.id,
                "content": msg.content[:100] + "..." if len(msg.content) > 100 else msg.content,
                "timestamp": msg.timestamp.isoformat(),
                "sentiment_label": msg.sentiment_label,
                "sentiment_score": msg.sentiment_score,
                "date": msg.timestamp.date().isoformat()
            })
        
        return result
        
    except Exception as e:
        logger.error(f"Error fetching sentiment history: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Duygu geçmişi yüklenirken hata oluştu"
        )
