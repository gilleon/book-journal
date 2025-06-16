import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  it('renders form inputs using findByLabelText when Add Book modal is opened', async () => {
    render(<BooksPage />);

    const addButton = screen.getByText('➕ Add New Book');
    fireEvent.click(addButton);

    const titleInput = await screen.findByLabelText(/title/i);
    const authorInput = await screen.findByLabelText(/author/i);
    const genreInput = await screen.findByLabelText(/genre/i);
    const yearInput = await screen.findByLabelText(/year/i);

    expect(titleInput).toBeInTheDocument();
    expect(authorInput).toBeInTheDocument();
    expect(genreInput).toBeInTheDocument();
    expect(yearInput).toBeInTheDocument();
  });

  it('renders radio buttons for update method using findByLabelText when editing', async () => {
    render(<BooksPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    const fullUpdateRadio = await screen.findByLabelText(/full update \(put\)/i);
    const partialUpdateRadio = await screen.findByLabelText(/partial update \(patch\)/i);

    expect(fullUpdateRadio).toBeInTheDocument();
    expect(partialUpdateRadio).toBeInTheDocument();
    expect(fullUpdateRadio).toBeChecked();
    expect(partialUpdateRadio).not.toBeChecked();
  });
});