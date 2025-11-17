const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface Player {
  playerId?: number | null;
  playerName?: string | null;
  ePlayerName?: string | null;
  nickname?: string | null;
  joinYyyy?: string | null;
  position?: string | null;
  backNo?: string | null;
  nation?: string | null;
  birthDate?: string | null;
  solar?: string | null;
  height?: string | null;
  weight?: string | null;
  teamId?: string | null;
}

export interface Team {
  teamId?: number | null;
  teamName?: string | null;
  eTeamName?: string | null;
  regionName?: string | null;
  stadiumId?: string | null;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Soccer Service - Player APIs
  async getPlayers() {
    return this.request('/api/soccer/player/all');
  }

  async getPlayer(id: string) {
    return this.request(`/api/soccer/player/${id}`);
  }

  async createPlayer(player: Player) {
    return this.request('/api/soccer/player/save', {
      method: 'POST',
      body: JSON.stringify(player),
    });
  }

  async updatePlayer(id: string, player: Player) {
    return this.request(`/api/soccer/player/${id}`, {
      method: 'PUT',
      body: JSON.stringify(player),
    });
  }

  async deletePlayer(id: string) {
    return this.request(`/api/soccer/player/${id}`, {
      method: 'DELETE',
    });
  }

  async searchPlayers(keyword: string) {
    return this.request(`/api/soccer/player/search?keyword=${encodeURIComponent(keyword)}`);
  }

  // Soccer Service - Team APIs
  async getTeams() {
    return this.request('/api/soccer/team/all');
  }

  async getTeam(id: string) {
    return this.request(`/api/soccer/team/${id}`);
  }

  async createTeam(team: Team) {
    return this.request('/api/soccer/team/save', {
      method: 'POST',
      body: JSON.stringify(team),
    });
  }

  async updateTeam(id: string, team: Team) {
    return this.request(`/api/soccer/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(team),
    });
  }

  async deleteTeam(id: string) {
    return this.request(`/api/soccer/team/${id}`, {
      method: 'DELETE',
    });
  }

  async searchTeams(keyword: string) {
    return this.request(`/api/soccer/team/search?keyword=${encodeURIComponent(keyword)}`);
  }
}

export const apiClient = new ApiClient();

