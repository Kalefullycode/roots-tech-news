/**
 * Generate a placeholder thumbnail if YouTube thumbnail fails
 */
export function generatePlaceholderThumbnail(
  title: string,
  category: string,
  width: number = 1280,
  height: number = 720
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // Background gradient based on category
  const gradients: Record<string, [string, string]> = {
    'AI': ['#667eea', '#764ba2'],
    'Tech': ['#10b981', '#059669'],
    'Podcasts': ['#8b5cf6', '#6d28d9'],
    'Business': ['#f59e0b', '#d97706'],
    'Tutorials': ['#ec4899', '#be185d'],
    'Innovation': ['#3b82f6', '#2563eb'],
    'Startups': ['#f97316', '#ea580c'],
    // Legacy category support
    'aiNews': ['#667eea', '#764ba2'],
    'techNews': ['#10b981', '#059669'],
    'podcasts': ['#8b5cf6', '#6d28d9'],
    'makeMoneyWithAI': ['#f59e0b', '#d97706'],
    'tutorials': ['#ec4899', '#be185d'],
    'aiVsHuman': ['#ef4444', '#dc2626']
  };

  const [color1, color2] = gradients[category] || ['#6b7280', '#4b5563'];

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add title text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Wrap text if too long
  const maxWidth = width - 100;
  const words = title.split(' ');
  let line = '';
  let y = height / 2;

  words.forEach(word => {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line, width / 2, y);
      line = word + ' ';
      y += 60;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, width / 2, y);

  // Add play icon
  ctx.beginPath();
  ctx.arc(width / 2, height / 2 + 150, 40, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(width / 2 - 10, height / 2 + 135);
  ctx.lineTo(width / 2 - 10, height / 2 + 165);
  ctx.lineTo(width / 2 + 15, height / 2 + 150);
  ctx.closePath();
  ctx.fillStyle = color1;
  ctx.fill();

  return canvas.toDataURL('image/jpeg', 0.8);
}

