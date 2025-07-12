import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Divider,
  Button,
  Grid,
  IconButton,
  Tooltip,
  useMediaQuery,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Badge
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  GroupWork as ProjectIcon,
  Business as CompanyIcon,
  EventAvailable as DeadlineIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

import { 
  formatDate, 
  formatSalary, 
  formatTimeRemaining, 
  formatWorkType,
  getOpportunityIcon,
  getMatchScoreColor
} from '../../utils/opportunityUtils';

const OpportunityDetailCard = ({ 
  opportunity, 
  onSave, 
  onShare, 
  onApply, 
  loading = false,
  matchScore = null,
  showActions = true,
  elevation = 1,
  sx = {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (!opportunity) return null;
  
  const {
    id,
    type,
    title,
    company,
    location,
    workType,
    salaryMin,
    salaryMax,
    salaryCurrency,
    salaryPeriod,
    deadline,
    description,
    requirements = [],
    responsibilities = [],
    benefits = [],
    skills = [],
    saved = false,
    hasApplied = false,
    postedAt,
    updatedAt,
    image,
    companyLogo,
    matchScore: opportunityMatchScore
  } = opportunity;
  
  const finalMatchScore = matchScore !== null ? matchScore : opportunityMatchScore;
  const matchPercentage = finalMatchScore ? Math.round(finalMatchScore * 100) : null;
  
  // Get the appropriate icon for the opportunity type
  const TypeIcon = getOpportunityIcon(type);
  
  // Format opportunity details
  const formattedDeadline = deadline ? format(new Date(deadline), 'd MMMM yyyy', { locale: tr }) : null;
  const timeRemaining = deadline ? formatTimeRemaining(deadline) : null;
  const postedDate = postedAt ? format(new Date(postedAt), 'd MMMM yyyy', { locale: tr }) : null;
  
  // Render detail item with icon
  const renderDetailItem = (icon, primary, secondary = null, onClick = null) => (
    <ListItem disableGutters dense disablePadding>
      <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
        {icon}
      </ListItemIcon>
      <ListItemText 
        primary={primary} 
        secondary={secondary} 
        primaryTypographyProps={{ variant: 'body2' }}
        secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
      />
      {onClick && (
        <IconButton size="small" onClick={onClick} edge="end">
          <ShareIcon fontSize="small" />
        </IconButton>
      )}
    </ListItem>
  );
  
  // Render a list of items (skills, requirements, etc.)
  const renderListItems = (items, icon = null, maxItems = 5) => {
    if (!items || items.length === 0) return null;
    
    const visibleItems = maxItems ? items.slice(0, maxItems) : items;
    const hasMore = maxItems && items.length > maxItems;
    
    return (
      <List dense disablePadding>
        {visibleItems.map((item, index) => (
          <ListItem key={index} disableGutters dense>
            {icon && (
              <ListItemIcon sx={{ minWidth: 32 }}>
                {icon}
              </ListItemIcon>
            )}
            <ListItemText 
              primary={item} 
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        ))}
        {hasMore && (
          <ListItem disableGutters dense>
            <Typography variant="caption" color="textSecondary">
              + {items.length - maxItems} daha...
            </Typography>
          </ListItem>
        )}
      </List>
    );
  };
  
  // Render match score if available
  const renderMatchScore = () => {
    if (matchPercentage === null) return null;
    
    const color = getMatchScoreColor(matchPercentage);
    
    return (
      <Box mb={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography variant="caption" color="textSecondary">
            Profil Uyumunuz
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} style={{ color }}>
            {matchPercentage}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={matchPercentage} 
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.palette.grey[200],
            '& .MuiLinearProgress-bar': {
              backgroundColor: color,
              borderRadius: 4,
            },
          }}
        />
      </Box>
    );
  };
  
  return (
    <Card 
      elevation={elevation}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...sx
      }}
    >
      {/* Header with title and company */}
      <CardHeader
        avatar={
          <Avatar 
            src={companyLogo || undefined} 
            alt={company?.name || 'Company'}
            sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}
          >
            {company?.name?.[0]?.toUpperCase() || 'C'}
          </Avatar>
        }
        action={
          <Box display="flex" alignItems="center">
            <Tooltip title={saved ? 'Kaydetmeyi kaldır' : 'Fırsatı kaydet'}>
              <IconButton 
                onClick={() => onSave?.(!saved)} 
                color={saved ? 'primary' : 'default'}
                disabled={loading}
              >
                {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Paylaş">
              <IconButton onClick={onShare} disabled={loading}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
        title={
          <Typography variant="h6" component="div" noWrap>
            {title}
          </Typography>
        }
        subheader={
          <Box>
            <Typography variant="subtitle1" color="primary" fontWeight={600}>
              {company?.name || 'Şirket adı belirtilmemiş'}
            </Typography>
            <Box display="flex" alignItems="center" mt={0.5}>
              <Chip 
                icon={<TypeIcon />}
                label={type === 'job' ? 'İş İlanı' : type === 'course' ? 'Kurs' : 'Proje'}
                size="small"
                sx={{ mr: 1, textTransform: 'capitalize' }}
              />
              <Typography variant="caption" color="textSecondary">
                {postedDate && `${postedDate} tarihinde yayınlandı`}
              </Typography>
            </Box>
          </Box>
        }
        sx={{
          '& .MuiCardHeader-content': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      />
      
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
        <Box p={3}>
          {/* Match score */}
          {renderMatchScore()}
          
          {/* Key details */}
          <Box 
            display="grid" 
            gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} 
            gap={2}
            mb={3}
          >
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              {renderDetailItem(
                <LocationIcon />,
                location || 'Konum belirtilmemiş',
                'Konum'
              )}
            </Paper>
            
            {workType && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                {renderDetailItem(
                  <WorkIcon />,
                  formatWorkType(workType),
                  'Çalışma Şekli'
                )}
              </Paper>
            )}
            
            {(salaryMin || salaryMax) && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                {renderDetailItem(
                  <MoneyIcon />,
                  formatSalary({ salaryMin, salaryMax, salaryCurrency, salaryPeriod }),
                  'Ücret'
                )}
              </Paper>
            )}
            
            {deadline && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                {renderDetailItem(
                  <DeadlineIcon />,
                  formattedDeadline,
                  timeRemaining,
                  onShare
                )}
              </Paper>
            )}
          </Box>
          
          {/* Description */}
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              Açıklama
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {description || 'Açıklama bulunamadı.'}
            </Typography>
          </Box>
          
          {/* Requirements */}
          {requirements?.length > 0 && (
            <Box mb={3}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Gereksinimler
              </Typography>
              {renderListItems(requirements, <StarIcon fontSize="small" color="primary" />)}
            </Box>
          )}
          
          {/* Responsibilities */}
          {responsibilities?.length > 0 && (
            <Box mb={3}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Sorumluluklar
              </Typography>
              {renderListItems(responsibilities, <StarIcon fontSize="small" color="primary" />)}
            </Box>
          )}
          
          {/* Benefits */}
          {benefits?.length > 0 && (
            <Box mb={3}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Avantajlar
              </Typography>
              {renderListItems(benefits, <StarIcon fontSize="small" color="primary" />)}
            </Box>
          )}
          
          {/* Skills */}
          {skills?.length > 0 && (
            <Box mb={3}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Gereken Yetkinlikler
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {skills.map((skill, index) => (
                  <Chip 
                    key={index} 
                    label={skill} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
        
        {/* Actions */}
        {showActions && (
          <Box 
            mt="auto" 
            p={2} 
            bgcolor={theme.palette.mode === 'dark' ? 'background.default' : 'grey.50'}
            borderTop={`1px solid ${theme.palette.divider}`}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary"
                  onClick={onApply}
                  disabled={loading || hasApplied}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  size={isMobile ? 'medium' : 'large'}
                >
                  {hasApplied 
                    ? type === 'job' 
                      ? 'Başvuruldu' 
                      : type === 'course' 
                        ? 'Kayıt Olundu' 
                        : 'Başvuru Yapıldı'
                    : type === 'job' 
                      ? 'Hemen Başvur' 
                      : type === 'course' 
                        ? 'Hemen Kayıt Ol' 
                        : 'Projeye Katıl'}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  color="primary"
                  onClick={onSave ? () => onSave(!saved) : undefined}
                  disabled={loading}
                  startIcon={saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  size={isMobile ? 'medium' : 'large'}
                >
                  {saved ? 'Kaydedildi' : 'Kaydet'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default OpportunityDetailCard;
