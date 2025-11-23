export interface StatsSummary {
    totalReviewed: number;
    totalReviewedToday: number;
    totalReviewedThisWeek: number;
    totalReviewedThisMonth: number;
    approvedPercentage: number;
    rejectedPercentage: number;
    requestChangesPercentage: number;
    averageReviewTime: number;
  }
  
  export interface ActivityData {
    date: string;
    approved: number;
    rejected: number;
    requestChanges: number;
  }
  
  export interface DecisionsData {
    approved: number;
    rejected: number;
    requestChanges: number;
  }
  