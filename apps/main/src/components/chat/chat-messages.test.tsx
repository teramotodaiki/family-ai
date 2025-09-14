import { render } from '@testing-library/react-native';
import { mockColors, mockMessages } from '../../test/fixtures';
import ChatMessages from './chat-messages';

describe('ChatMessages', () => {
  it('should render empty when no messages', () => {
    const { queryByTestId } = render(
      <ChatMessages colors={mockColors} messages={[]} />
    );

    expect(queryByTestId('message-user')).toBeNull();
    expect(queryByTestId('message-assistant')).toBeNull();
  });

  it('should render user and assistant messages', () => {
    const { getByTestId, getAllByTestId } = render(
      <ChatMessages colors={mockColors} messages={mockMessages} />
    );

    expect(getByTestId('message-user')).toBeTruthy();
    expect(getByTestId('message-assistant')).toBeTruthy();
    expect(getAllByTestId(/message-/)).toHaveLength(2);
  });

  it('should display correct message text', () => {
    const { getByText } = render(
      <ChatMessages colors={mockColors} messages={mockMessages} />
    );

    expect(getByText('こんにちは')).toBeTruthy();
    expect(
      getByText('こんにちは！何かお手伝いできることはありますか？')
    ).toBeTruthy();
  });

  it('should apply correct testID for user messages', () => {
    const userMessage = [mockMessages[0]];
    const { getByTestId } = render(
      <ChatMessages colors={mockColors} messages={userMessage} />
    );

    expect(getByTestId('message-user')).toBeTruthy();
  });

  it('should apply correct testID for assistant messages', () => {
    const assistantMessage = [mockMessages[1]];
    const { getByTestId } = render(
      <ChatMessages colors={mockColors} messages={assistantMessage} />
    );

    expect(getByTestId('message-assistant')).toBeTruthy();
  });

  it('should handle single message', () => {
    const singleMessage = [mockMessages[0]];
    const { getByTestId, queryByTestId } = render(
      <ChatMessages colors={mockColors} messages={singleMessage} />
    );

    expect(getByTestId('message-user')).toBeTruthy();
    expect(queryByTestId('message-assistant')).toBeNull();
  });

  it('should render messages with unique keys', () => {
    const messagesWithSameContent = [
      { ...mockMessages[0], id: '1' },
      { ...mockMessages[0], id: '2' },
    ];

    const { getAllByText } = render(
      <ChatMessages colors={mockColors} messages={messagesWithSameContent} />
    );

    expect(getAllByText('こんにちは')).toHaveLength(2);
  });
});
