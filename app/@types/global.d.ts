declare global {
    interface authProps {
        id: number;
        name: string;
        email: string;
        role: string;
        isWarning: boolean;
        image: string;
    }

    type RootStackParamList = {
      SplashScreen: undefined;
      Login: undefined;
      Home: undefined;
      OnBoarding: undefined;
    };

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

    interface moodWeeklyProps {
      id: number;
      user_id: authProps;
      mood: moodProps[];
      mood_user: string;
      desc: string;
      created_at: any;
    }

    interface moodProps {
      id: number;
      user_id: authProps;
      mood_weekly_id: moodWeeklyProps;
      suggestion: string;
      statistic: number;
      created_at: any;
    }
}

export {};
