
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.48b8cd5597f7435e9fdea5e8303cb75e',
  appName: 'oyakudachi-pill-pal',
  webDir: 'dist',
  server: {
    url: 'https://48b8cd55-97f7-435e-9fde-a5e8303cb75e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF',
      sound: 'beep.wav'
    }
  }
};

export default config;
