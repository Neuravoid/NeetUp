import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import personalityTestService from '../../api/personality-test';

// Coalition types based on the personality test document
const COALITION_TYPES = [
  'Yenilikçi Kaşif',
  'Metodik Uzman',
  'Sosyal Lider',
  'Takım Oyuncusu',
  'Soğukkanlı Stratejist',
  'Hayalperest Sanatçı',
  'Bilimsel Araştırmacı',
  'Pratik Çözümcü',
  'Duyarlı Bakıcı',
  'Macera Tutkunu'
];

// Initial state
const initialState = {
  activeSection: 0,
  questions: [],
  coalitionTypes: COALITION_TYPES,
  answers: {},
  results: null,
  loading: false,
  error: null,
  testCompleted: false
};

// Async thunks
export const fetchQuestions = createAsyncThunk(
  'personalityTest/fetchQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const data = await personalityTestService.getQuestions();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Sorular yüklenemedi');
    }
  }
);

export const submitAnswers = createAsyncThunk(
  'personalityTest/submitAnswers',
  async (answers, { rejectWithValue }) => {
    try {
      const data = await personalityTestService.submitAnswers(answers);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Cevaplar gönderilemedi');
    }
  }
);

export const fetchResults = createAsyncThunk(
  'personalityTest/fetchResults',
  async (_, { rejectWithValue }) => {
    try {
      const data = await personalityTestService.getResults();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Sonuçlar yüklenemedi');
    }
  }
);

// If the real API is not yet available, we can use this mock data
const mockQuestions = () => {
  const questions = [];
  
  // Generate 5 questions for each coalition type
  COALITION_TYPES.forEach((coalition, coalitionIndex) => {
    for (let i = 1; i <= 5; i++) {
      questions.push({
        id: `${coalitionIndex + 1}_${i}`,
        section: coalitionIndex,
        coalition_type: coalition,
        text: `${coalition} için örnek soru ${i}`,
        description: `Bu, ${coalition} koalisyon tipi için ${i}. sorudur.`
      });
    }
  });
  
  return questions;
};

const personalityTestSlice = createSlice({
  name: 'personalityTest',
  initialState,
  reducers: {
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
    setAnswer: (state, action) => {
      const { questionId, value } = action.payload;
      state.answers[questionId] = value;
    },
    resetTest: (state) => {
      state.activeSection = 0;
      state.answers = {};
      state.results = null;
      state.testCompleted = false;
      state.error = null;
    },
    // For development/testing purposes only
    loadMockQuestions: (state) => {
      state.questions = mockQuestions();
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch questions cases
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
        state.error = null;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // If the API isn't ready, load mock questions
        state.questions = mockQuestions();
      })
      
      // Submit answers cases
      .addCase(submitAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.testCompleted = true;
        state.error = null;
      })
      .addCase(submitAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch results cases
      .addCase(fetchResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.error = null;
        
        // If results exist, mark test as completed
        if (action.payload) {
          state.testCompleted = true;
        }
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setActiveSection, setAnswer, resetTest, loadMockQuestions } = personalityTestSlice.actions;
export default personalityTestSlice.reducer;
