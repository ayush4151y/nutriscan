import { ImageResponse } from 'next/og';
import { Leaf } from 'lucide-react';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'hsl(96, 100%, 97%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'hsl(120, 73%, 75%)',
          borderRadius: '8px',
        }}
      >
        <Leaf size={24} />
      </div>
    ),
    {
      ...size,
    }
  );
}
