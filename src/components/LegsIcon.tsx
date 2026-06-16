import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/colors';

// Line-art pair of legs as an outlined silhouette, front view: wider hips,
// thighs tapering to the knees, calves, narrow ankles, and small feet pointing
// outward, with an open stance gap between the legs. Closed outline, no fill.
export function LegsIcon({
  size = 20,
  color = colors.inkSoft,
  strokeWidth = 1.3,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 4.8
           C6.5 8 6.9 10.6 7.5 13
           C8 15.2 8.2 16.8 8.3 18.4
           C8.35 19.1 8 19.5 7 19.6
           C6.4 19.7 6.4 20.3 7.3 20.4
           C8.6 20.55 9.6 20.2 9.7 19.1
           C9.85 17 10 14.6 10.4 12
           C10.6 10.6 10.9 9.5 11.5 8.8
           C11.8 8.45 12.2 8.45 12.5 8.8
           C13.1 9.5 13.4 10.6 13.6 12
           C14 14.6 14.15 17 14.3 19.1
           C14.4 20.2 15.4 20.55 16.7 20.4
           C17.6 20.3 17.6 19.7 17 19.6
           C16 19.5 15.65 19.1 15.7 18.4
           C15.8 16.8 16 15.2 16.5 13
           C17.1 10.6 17.5 8 17 4.8
           Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
