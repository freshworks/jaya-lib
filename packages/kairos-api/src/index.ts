import axios, { AxiosPromise } from 'axios';

export interface KairosSchedule {
  data: {
    externalEventUrl: string;
  };
  deleted: number;
  group: string;
  job_id: string;
  scheduled_time: string;
  webhook: {
    url: string;
  };
}

export interface KairosScheduleOptions {
  jobId: string;
  payload: object | null;
  scheduledTime: string;
  webhookUrl: string;
}

interface KairosRequestHeader {
  'Content-Type': string;
  'cache-control': string;
  service: string;
}

export default class Kairos {
  private group: string;

  private token: string;

  private url: string;

  constructor(opts: { group: string; token: string; url: string }) {
    this.group = opts.group;
    this.token = opts.token;
    this.url = opts.url;
  }

  private get headers(): KairosRequestHeader {
    return {
      'Content-Type': 'application/json',
      'cache-control': 'no-cache',
      service: this.token,
    };
  }

  /**
   * Fetches a schedule.
   */
  fetchSchedule(jobId: string): Promise<KairosSchedule> {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.url}/schedules/${this.group}/${jobId}`, {
          headers: this.headers,
        })
        .then(
          (data: object) => {
            const dataObj = data as { data: KairosSchedule };
            const response = dataObj && dataObj.data;

            if (!response || response.deleted) {
              reject();
            } else {
              resolve(response);
            }
          },
          () => {
            reject();
          },
        );
    });
  }

  /**
   * Creates a schedule using Kairos.
   */
  createSchedule(opts: KairosScheduleOptions): AxiosPromise<string> {
    const body = {
      data: opts.payload,
      group: this.group,
      job_id: opts.jobId,
      scheduled_time: opts.scheduledTime,
      webhook: {
        url: opts.webhookUrl,
      },
    };

    return axios.post(`${this.url}/schedules`, JSON.stringify(body), {
      headers: this.headers,
    });
  }

  /**
   * Deletes a schedule using in Kairos.
   */
  deleteSchedule(jobId: string): AxiosPromise<string> {
    return axios.delete(`${this.url}/schedules/${this.group}/${jobId}`, {
      headers: this.headers,
    });
  }

  /**
   * Creates a schedule using Kairos.
   */
  bulkCreateSchedules(optsArr: KairosScheduleOptions[]): AxiosPromise<string> {
    const body = optsArr.map((opts) => {
      return {
        data: opts.payload,
        job_id: opts.jobId,
        scheduled_time: opts.scheduledTime,
        webhook: {
          url: opts.webhookUrl,
        },
      };
    });

    return axios.post(`${this.url}/bulk/${this.group}/schedules`, JSON.stringify(body), { headers: this.headers });
  }

  /**
   * Bulk deletes a schedules using Kairos.
   */
  bulkDeleteSchedules(jobIds: string[]): AxiosPromise<string> {
    return axios.post(`${this.url}/bulk/${this.group}/delete`, JSON.stringify(jobIds), { headers: this.headers });
  }
}
