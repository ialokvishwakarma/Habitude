import axiosClient from '../../api/axiosClient';

const recommendationService = {
  // Standard Benchmarks: GET /api/recommendations?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
  getStandardBenchmarks: async (startDate, endDate) => {
    const response = await axiosClient.get('/recommendations', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // AI Coach: POST /api/ai-recommendation/activity?focusId=X&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
  getAICoachInsight: async (focusId, startDate, endDate) => {
    const response = await axiosClient.post(
      '/ai-recommendation/activity',
      null, // No request body needed because backend expects @RequestParam
      {
        params: {
          focusId,
          startDate,
          endDate,
        },
      }
    );
    return response.data; // Raw String from Spring AI
  },
};

export default recommendationService;