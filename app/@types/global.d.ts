declare global {
  interface authProps {
    id: number;
    name: string;
    email: string;
    role: string;
    isWarning: boolean;
    image: string;
  }

  interface newsProps {
    id: number;
    title: string;
    desc: string;
    detail: string;
    image: string;
    created_at: any;
  }

  interface communityProps {
    id: number;
    name: string;
    desc: string;
    image: string;
    created_at: any;
  }

  interface communityPostProps {
    id: number;
    community_id: communityProps;
    user_id: authProps;
    message: string;
    image: string;
    created_at: any;
  }

  interface communityMemberProps {
    id: number;
    community_id: communityProps;
    user_id: authProps;
    created_at: any;
  }

  interface reportProps {
    id: number;
    title: string;
    desc: string;
    image: string;
    location: string;
    status: string;
    created_at: any;
  }

  interface doctorProps {
    id: number;
    user_id: authProps;
    category: string;
    hospital: string;
    created_at: any
  }

  interface conversationProps {
    id: number;
    message: messageProps[];
    sender: authProps;
    receiver: authProps;
    created_at: any;
  }

  interface messageProps {
    id: number;
    conversation_id: conversationProps;
    sender: authProps;
    message: string;
    image: string;
    created_at: any;
  }

  interface mediationProps {
    id: number;
    title: string;
    song: string;
    author: string;
    image: string;
    created_at: any;
  }

  interface moodAnalysisProps {
    id: number;
    user_id: authProps;
    mood: moodProps[];
    mood_user: string;
    summary: string;
    suggestion: string;
    statistic: number;
    created_at: any;
  }

  interface moodProps {
    id: number;
    user_id: authProps;
    mood_analysis_id: moodAnalysisProps;
    mood: string;
    desc: string;
    created_at: any;
  }

  interface zoneProps {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    radius: string;
    created_at: any;
  }

  interface suggestionPlaceProps {
    type: "Feature";
    properties: {
      name: string;
      country: string;
      country_code: string;
      state: string;
      city: string;
      village?: string;
      postcode?: string;
      district?: string;
      suburb?: string;
      city_block?: string;
      street?: string;
      housenumber?: string;
      iso3166_2?: string;
      iso3166_2_sublevel?: string;
      lon: number;
      lat: number;
      formatted: string;
      address_line1: string;
      address_line2: string;
      categories: string[];
      details?: string[];

      datasource: {
        sourcename: string;
        attribution: string;
        license: string;
        url: string;
        raw: {
          name?: string;
          phone?: string;
          office?: string;
          osm_id?: number;
          landuse?: string;
          website?: string;
          osm_type?: string;
          "addr:city"?: string;
          "addr:street"?: string;
          "addr:postcode"?: number;
          "addr:housenumber"?: string;
          [key: string]: any;
        };
      };

      website?: string;

      brand_details?: {
        wikidata?: string;
        wikipedia?: string;
      };

      name_international?: {
        [languageCode: string]: string;
      };

      contact?: {
        phone?: string;
      };

      place_id: string;
    };

    geometry: {
      type: "Point";
      coordinates: [number, number];
    };
  }

  interface chatbotConverstionProps {
    id: number;
    user_id: authProps;
    chatbot_message: chatbotMessageProps[];
    created_at: any;
  }

  interface chatbotMessageProps {
    id: number;
    message: string;
    conversation_id: number;
    role: string;
    created_at: any;
  }
}

export { };
