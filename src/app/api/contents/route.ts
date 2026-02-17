import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

const DATA_FILE = join(process.cwd(), 'src/data/contents.json');

export async function GET() {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    const contents = JSON.parse(data);
    return NextResponse.json(contents);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read contents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newContent = await request.json();

    const data = await readFile(DATA_FILE, 'utf-8');
    const contents = JSON.parse(data);

    contents.push(newContent);

    await writeFile(DATA_FILE, JSON.stringify(contents, null, 2), 'utf-8');

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { index, data: updatedContent } = await request.json();

    if (typeof index !== 'number') {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }

    const data = await readFile(DATA_FILE, 'utf-8');
    const contents = JSON.parse(data);

    if (index < 0 || index >= contents.length) {
      return NextResponse.json({ error: 'Index out of range' }, { status: 400 });
    }

    contents[index] = updatedContent;

    await writeFile(DATA_FILE, JSON.stringify(contents, null, 2), 'utf-8');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { index } = await request.json();

    if (typeof index !== 'number') {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }

    const data = await readFile(DATA_FILE, 'utf-8');
    const contents = JSON.parse(data);

    if (index < 0 || index >= contents.length) {
      return NextResponse.json({ error: 'Index out of range' }, { status: 400 });
    }

    contents.splice(index, 1);

    await writeFile(DATA_FILE, JSON.stringify(contents, null, 2), 'utf-8');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
  }
}
