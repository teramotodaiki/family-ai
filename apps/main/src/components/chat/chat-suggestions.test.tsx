import { fireEvent, render } from '@testing-library/react-native';
import { mockColors, mockSuggestions } from '../../test/fixtures';
import ChatSuggestions from './chat-suggestions';

describe('ChatSuggestions', () => {
  const defaultProps = {
    colors: mockColors,
    suggestions: mockSuggestions,
    onSelect: jest.fn(),
  };

  it('should render all suggestions', () => {
    const { getByText } = render(<ChatSuggestions {...defaultProps} />);

    expect(getByText('Explain MCP')).toBeTruthy();
    expect(getByText('structured content')).toBeTruthy();
    expect(getByText('Explore AI')).toBeTruthy();
    expect(getByText('agent frameworks')).toBeTruthy();
    expect(getByText('Summary')).toBeTruthy();
    expect(getByText('AI research')).toBeTruthy();
  });

  it('should render empty when no suggestions', () => {
    const { queryByText } = render(
      <ChatSuggestions {...defaultProps} suggestions={[]} />
    );

    expect(queryByText('Explain MCP')).toBeNull();
  });

  it('should call onSelect when suggestion is tapped', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <ChatSuggestions {...defaultProps} onSelect={onSelect} />
    );

    const suggestion = getByText('Explain MCP');
    fireEvent.press(suggestion);

    expect(onSelect).toHaveBeenCalledWith(mockSuggestions[0].text);
  });

  it('should handle multiple suggestion selections', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <ChatSuggestions {...defaultProps} onSelect={onSelect} />
    );

    fireEvent.press(getByText('Explain MCP'));
    fireEvent.press(getByText('Explore AI'));

    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenNthCalledWith(1, mockSuggestions[0].text);
    expect(onSelect).toHaveBeenNthCalledWith(2, mockSuggestions[1].text);
  });
});
