import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import BooksPage from '../page';

global.fetch = jest.fn();

const mockBooks = [
  {
    id: 1,
    title: 'Test Book 1',
    author: 'Test Author 1',
    genre: 'Fiction',
    published_year: 2020
  },
  {
    id: 2,
    title: 'Test Book 2',
    author: 'Test Author 2',
    genre: 'Non-Fiction',
    published_year: 2021
  }
];

describe('BooksPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockBooks,
    });
    HTMLFormElement.prototype.requestSubmit = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loads and displays books using waitFor', async () => {
    render(<BooksPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/books'));
  });

  it('handles form submission and updates book list using waitFor', async () => {
    const user = userEvent.setup();
    
    const newBook = {
      id: 3,
      title: 'New Book',
      author: 'New Author',
      genre: 'Mystery',
      published_year: 2023
    };

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBooks,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => newBook,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [...mockBooks, newBook],
      });

    render(<BooksPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    const addButton = screen.getByText('➕ Add New Book');
    await user.click(addButton);

    const titleInput = await screen.findByLabelText(/title/i);
    const authorInput = await screen.findByLabelText(/author/i);
    const genreInput = await screen.findByLabelText(/genre/i);
    const yearInput = await screen.findByLabelText(/year/i);

    await user.type(titleInput, 'New Book');
    await user.type(authorInput, 'New Author');
    await user.type(genreInput, 'Mystery');
    await user.type(yearInput, '2023');

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/books'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'New Book',
            author: 'New Author',
            genre: 'Mystery',
            published_year: 2023
          })
        })
      );
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });
});