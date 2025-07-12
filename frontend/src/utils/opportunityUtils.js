import {
  Work as WorkIcon,
  School as SchoolIcon,
  GroupWork as ProjectIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  EventAvailable as DeadlineIcon,
  Category as CategoryIcon,
  Business as CompanyIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon,
} from '@mui/icons-material';

/**
 * Get the appropriate icon for an opportunity type
 * @param {string} type - Opportunity type ('job', 'course', 'project')
 * @returns {JSX.Element} - Icon component
 */
export const getOpportunityIcon = (type) => {
  switch (type) {
    case 'job':
      return <WorkIcon fontSize="small" />;
    case 'course':
      return <SchoolIcon fontSize="small" />;
    case 'project':
      return <ProjectIcon fontSize="small" />;
    default:
      return <WorkIcon fontSize="small" />;
  }
};

/**
 * Format salary/compensation information for display
 * @param {Object} opportunity - Opportunity object
 * @returns {string} - Formatted salary string
 */
export const formatSalary = (opportunity) => {
  if (!opportunity) return 'Ücret bilgisi yok';
  
  const { salaryMin, salaryMax, salaryCurrency = 'TRY', salaryPeriod = 'month' } = opportunity;
  
  if (salaryMin === undefined || salaryMax === undefined) {
    return 'Ücret bilgisi yok';
  }
  
  const currencySymbol = {
    TRY: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£'
  }[salaryCurrency] || salaryCurrency;
  
  const periodText = {
    hour: 'saatlik',
    day: 'günlük',
    week: 'haftalık',
    month: 'aylık',
    year: 'yıllık',
    project: 'proje bazlı',
    one_time: 'tek seferlik'
  }[salaryPeriod] || '';
  
  return `${salaryMin.toLocaleString('tr-TR')} - ${salaryMax.toLocaleString('tr-TR')} ${currencySymbol} ${periodText}`;
};

/**
 * Format date for display
 * @param {string|Date} date - Date string or Date object
 * @param {string} format - Format type ('short', 'medium', 'long', 'full')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options = {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    medium: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    long: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    full: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }
  }[format] || {};
  
  return dateObj.toLocaleDateString('tr-TR', options);
};

/**
 * Format time remaining until a deadline
 * @param {string|Date} deadline - Deadline date
 * @returns {string} - Formatted time remaining string
 */
export const formatTimeRemaining = (deadline) => {
  if (!deadline) return '';
  
  const now = new Date();
  const end = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const diffMs = end - now;
  
  if (diffMs <= 0) return 'Süre doldu';
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} gün ${diffHours} saat kaldı`;
  } else if (diffHours > 0) {
    return `${diffHours} saat ${diffMins} dakika kaldı`;
  } else {
    return `${diffMins} dakika kaldı`;
  }
};

/**
 * Get the appropriate color for a match score
 * @param {number} score - Match score (0-100)
 * @returns {string} - Color string
 */
export const getMatchScoreColor = (score) => {
  if (score >= 80) return '#4caf50'; // Green
  if (score >= 60) return '#8bc34a'; // Light green
  if (score >= 40) return '#ffc107'; // Yellow
  if (score >= 20) return '#ff9800'; // Orange
  return '#f44336'; // Red
};

/**
 * Render star rating component
 * @param {number} rating - Rating value (0-5)
 * @param {Object} options - Options for the star rating
 * @returns {JSX.Element} - Star rating component
 */
export const renderStarRating = (rating, options = {}) => {
  const { size = 'small', color = 'primary', readOnly = true } = options;
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarIcon key={`full-${i}`} fontSize={size} color={color} />);
  }
  
  // Half star
  if (hasHalfStar) {
    stars.push(<StarHalfIcon key="half" fontSize={size} color={color} />);
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<StarBorderIcon key={`empty-${i}`} fontSize={size} color={color} />);
  }
  
  return <Box display="inline-flex" alignItems="center">{stars}</Box>;
};

/**
 * Format opportunity type for display
 * @param {string} type - Opportunity type
 * @returns {string} - Formatted type string
 */
export const formatOpportunityType = (type) => {
  const types = {
    job: 'İş İlanı',
    course: 'Kurs',
    project: 'Proje'
  };
  
  return types[type] || type;
};

/**
 * Get the appropriate icon for a detail field
 * @param {string} field - Field name
 * @returns {JSX.Element} - Icon component
 */
export const getDetailIcon = (field) => {
  const icons = {
    location: <LocationIcon fontSize="small" />,
    type: <CategoryIcon fontSize="small" />,
    company: <CompanyIcon fontSize="small" />,
    deadline: <DeadlineIcon fontSize="small" />,
    salary: <MoneyIcon fontSize="small" />,
    duration: <TimeIcon fontSize="small" />,
    experience: <WorkIcon fontSize="small" />
  };
  
  return icons[field] || null;
};

/**
 * Format work type for display
 * @param {string} workType - Work type
 * @returns {string} - Formatted work type string
 */
export const formatWorkType = (workType) => {
  const types = {
    full_time: 'Tam Zamanlı',
    part_time: 'Yarı Zamanlı',
    contract: 'Sözleşmeli',
    temporary: 'Geçici',
    internship: 'Staj',
    freelance: 'Serbest Çalışma',
    remote: 'Uzaktan',
    hybrid: 'Hibrit',
    on_site: 'Ofis'
  };
  
  return types[workType] || workType;
};

export default {
  getOpportunityIcon,
  formatSalary,
  formatDate,
  formatTimeRemaining,
  getMatchScoreColor,
  renderStarRating,
  formatOpportunityType,
  getDetailIcon,
  formatWorkType
};
