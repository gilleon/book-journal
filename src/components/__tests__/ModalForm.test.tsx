import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalForm from '../ModalForm';

describe('ModalForm', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  
  const defaultProps = {
    title: 'Test Modal',
    show: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    children: <div>Modal Content</div>,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();
    HTMLFormElement.prototype.requestSubmit = jest.fn();
  });

  it('renders modal when show is true using queryByText', () => {
    render(<ModalForm {...defaultProps} />);

    const title = screen.queryByText('Test Modal');
    const content = screen.queryByText('Modal Content');
    const submitButton = screen.queryByText('Submit');
    const cancelButton = screen.queryByText('Cancel');

    expect(title).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it('does not render modal when show is false using queryByText', () => {
    render(<ModalForm {...defaultProps} show={false} />);

    const title = screen.queryByText('Test Modal');
    const content = screen.queryByText('Modal Content');
    const submitButton = screen.queryByText('Submit');
    const cancelButton = screen.queryByText('Cancel');

    expect(title).not.toBeInTheDocument();
    expect(content).not.toBeInTheDocument();
    expect(submitButton).not.toBeInTheDocument();
    expect(cancelButton).not.toBeInTheDocument();
  });

  it('renders confirm and cancel buttons in confirmOnly mode using queryByText', () => {
    render(<ModalForm {...defaultProps} confirmOnly={true} />);

    const confirmButton = screen.queryByText('Confirm');
    const submitButton = screen.queryByText('Submit');
    const cancelButton = screen.queryByText('Cancel');

    expect(confirmButton).toBeInTheDocument();
    expect(submitButton).not.toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked using queryByText', () => {
    render(<ModalForm {...defaultProps} />);

    const cancelButton = screen.queryByText('Cancel');
    expect(cancelButton).toBeInTheDocument();
    
    fireEvent.click(cancelButton!);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when Confirm button is clicked in confirmOnly mode using queryByText', () => {
    render(<ModalForm {...defaultProps} confirmOnly={true} />);

    const confirmButton = screen.queryByText('Confirm');
    expect(confirmButton).toBeInTheDocument();
    
    fireEvent.click(confirmButton!);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});