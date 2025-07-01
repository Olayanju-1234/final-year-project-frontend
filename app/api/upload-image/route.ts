import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const folder = formData.get('folder') as string || 'rentmatch-uploads';

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const dataURI = `data:${image.type};base64,${base64Image}`;

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: dataURI,
          folder: folder,
          upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        }),
      }
    );

    if (!cloudinaryResponse.ok) {
      throw new Error('Failed to upload to Cloudinary');
    }

    const cloudinaryData = await cloudinaryResponse.json();

    console.log('Cloud name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
    console.log('Preset:', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    return NextResponse.json({
      success: true,
      url: cloudinaryData.secure_url,
      publicId: cloudinaryData.public_id,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 