import { ConsultationDiagnosis, ConsultationRecord, SampleCase, UserProfile, WeatherTelemetry } from '../types';

export const api = {
  // Submit new multimodal crop consultation
  async createConsultation(formData: FormData, token: string): Promise<{
    consultationId: string;
    result: ConsultationDiagnosis;
    consultation: ConsultationRecord;
  }> {
    const response = await fetch('/api/consultations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || `Consultation analysis failed with status ${response.status}`);
    }

    return response.json();
  },

  // List past consultations
  async getConsultations(token: string, filters?: { cropType?: string; urgency?: string; search?: string }): Promise<ConsultationRecord[]> {
    const params = new URLSearchParams();
    if (filters?.cropType) params.append('cropType', filters.cropType);
    if (filters?.urgency) params.append('urgency', filters.urgency);
    if (filters?.search) params.append('search', filters.search);

    const response = await fetch(`/api/consultations?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve consultation history');
    }

    const data = await response.json();
    return data.consultations || [];
  },

  // Get consultation by ID
  async getConsultationById(id: string, token: string): Promise<ConsultationRecord> {
    const response = await fetch(`/api/consultations/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('Consultation report not found');
    }

    const data = await response.json();
    return data.consultation;
  },

  // Delete consultation
  async deleteConsultation(id: string, token: string): Promise<void> {
    const response = await fetch(`/api/consultations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('Failed to delete consultation record');
    }
  },

  // Get farm profile
  async getProfile(token: string): Promise<UserProfile> {
    const response = await fetch('/api/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile settings');
    }

    const data = await response.json();
    return data.profile;
  },

  // Update farm profile
  async updateProfile(profileData: Partial<UserProfile>, token: string): Promise<UserProfile> {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(err.error || 'Failed to update profile settings');
    }

    const data = await response.json();
    return data.profile;
  },

  // Get weather telemetry
  async getWeather(location?: string): Promise<WeatherTelemetry> {
    const params = location ? `?location=${encodeURIComponent(location)}` : '';
    const response = await fetch(`/api/weather${params}`);

    if (!response.ok) {
      throw new Error('Failed to retrieve agricultural weather telemetry');
    }

    const data = await response.json();
    return data.weather;
  },

  // Get pre-configured diagnostic sample cases
  async getSampleCases(token: string): Promise<SampleCase[]> {
    const response = await fetch('/api/sample-cases', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.samples || [];
  },

  // System Health
  async getHealth(): Promise<any> {
    const response = await fetch('/api/health');
    return response.json();
  }
};
