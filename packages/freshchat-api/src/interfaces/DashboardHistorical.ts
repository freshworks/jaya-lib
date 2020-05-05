export interface DashboardHistorical {
  aggregator: string;
  data: {
    groupings: {
      key: string;
      value: string;
    }[];
    series: {
      end?: string;
      start?: string;
      values: {
        key: string;
        value: string;
      }[];
    }[];
  }[];
  end: string;
  filters: {
    metric_filters: string[];
  };
  interval: string;
  metrics: string[];
  start: string;
}
