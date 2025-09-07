import { fireEvent, render } from '@testing-library/react-native';
import { mockColors } from '../../test/fixtures';
import ChatInputBar from './chat-input-bar';

describe('ChatInputBar', () => {
  const defaultProps = {
    colors: mockColors,
    value: '',
    onChange: jest.fn(),
    onSend: jest.fn(),
    sending: false,
    onToggleAttachments: jest.fn(),
    bottomInset: 34,
    sendIconColor: '#000',
  };

  it('should render correctly', () => {
    const { getByTestId } = render(<ChatInputBar {...defaultProps} />);

    expect(getByTestId('chat-input')).toBeTruthy();
    expect(getByTestId('send-button')).toBeTruthy();
  });

  it('should display input value', () => {
    const { getByTestId } = render(
      <ChatInputBar {...defaultProps} value='Hello' />
    );

    const input = getByTestId('chat-input');
    expect(input.props.value).toBe('Hello');
  });

  it('should call onChange when text changes', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <ChatInputBar {...defaultProps} onChange={onChange} />
    );

    const input = getByTestId('chat-input');
    fireEvent.changeText(input, 'New text');

    expect(onChange).toHaveBeenCalledWith('New text');
  });

  it('should call onSend when send button is pressed', () => {
    const onSend = jest.fn();
    const { getByTestId } = render(
      <ChatInputBar {...defaultProps} value='Hello' onSend={onSend} />
    );

    const sendButton = getByTestId('send-button');
    fireEvent.press(sendButton);

    expect(onSend).toHaveBeenCalled();
  });

  it('should disable send button when sending', () => {
    const { getByTestId } = render(
      <ChatInputBar {...defaultProps} value='Hello' sending={true} />
    );

    const sendButton = getByTestId('send-button');
    expect(sendButton.props.accessibilityState.disabled).toBe(true);
  });

  it('should disable send button when value is empty', () => {
    const { getByTestId } = render(<ChatInputBar {...defaultProps} value='' />);

    const sendButton = getByTestId('send-button');
    expect(sendButton.props.accessibilityState.disabled).toBe(true);
  });

  it('should disable send button when value is only whitespace', () => {
    const { getByTestId } = render(
      <ChatInputBar {...defaultProps} value='   ' />
    );

    const sendButton = getByTestId('send-button');
    expect(sendButton.props.accessibilityState.disabled).toBe(true);
  });

  it('should call onToggleAttachments when attachment button is pressed', () => {
    const onToggleAttachments = jest.fn();
    const { getByTestId } = render(
      <ChatInputBar
        {...defaultProps}
        onToggleAttachments={onToggleAttachments}
      />
    );

    const attachButton = getByTestId('attachment-button');
    fireEvent.press(attachButton);

    expect(onToggleAttachments).toHaveBeenCalled();
  });

  it('should have correct placeholder text', () => {
    const { getByTestId } = render(<ChatInputBar {...defaultProps} />);

    const input = getByTestId('chat-input');
    expect(input.props.placeholder).toBe('質問してみましょう');
  });

  it('should be multiline', () => {
    const { getByTestId } = render(<ChatInputBar {...defaultProps} />);

    const input = getByTestId('chat-input');
    expect(input.props.multiline).toBe(true);
  });
});
