import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

async function BooksServerComponent() {
  const response = await fetch('/api/books');
  const books = await response.json();
  
  return (
    <div>
      <h1>Books</h1>
      {books.map((book: any) => (
        <div key={book.id} data-testid={`book-${book.id}`}>
          <h2>{book.title}</h2>
          <p>{book.author}</p>
        </div>
      ))}
    </div>
  );
}

global.fetch = jest.fn();

describe('BooksServerComponent - Async Server Component', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, title: 'Server Book 1', author: 'Server Author 1' },
        { id: 2, title: 'Server Book 2', author: 'Server Author 2' }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders server component with async data', async () => {
    const ServerComponentWithData = await BooksServerComponent();
    render(ServerComponentWithData);

    expect(screen.getByText('Server Book 1')).toBeInTheDocument();
    expect(screen.getByText('Server Author 1')).toBeInTheDocument();
    expect(screen.getByTestId('book-1')).toBeInTheDocument();
  });

  it('handles server component with empty data', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => []
    });

    const ServerComponentWithData = await BooksServerComponent();
    render(ServerComponentWithData);

    expect(screen.getByText('Books')).toBeInTheDocument();
    expect(screen.queryByTestId(/book-/)).not.toBeInTheDocument();
  });
});