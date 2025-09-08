import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { mockColors, mockModels } from '../../test/fixtures';
import ChatModelModal from './chat-model-modal';

describe('ChatModelModal', () => {
  const defaultProps = {
    colors: mockColors,
    visible: true,
    models: mockModels,
    selectedModel: 'GPT-5',
    onSelect: jest.fn(),
    onClose: jest.fn(),
  };

  it('should render when visible', () => {
    const { getByText } = render(<ChatModelModal {...defaultProps} />);

    expect(getByText('GPT-5')).toBeTruthy();
    expect(getByText('フラッグシップモデル')).toBeTruthy();
    expect(getByText('GPT-5 Thinking')).toBeTruthy();
    expect(getByText('より深い回答を得る')).toBeTruthy();
  });

  it('should not render when not visible', () => {
    const { queryByText } = render(
      <ChatModelModal {...defaultProps} visible={false} />
    );

    expect(queryByText('GPT-5')).toBeNull();
  });

  it('should call onSelect when model is selected', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <ChatModelModal {...defaultProps} onSelect={onSelect} />
    );

    const model = getByText('GPT-5 Thinking');
    fireEvent.press(model);

    expect(onSelect).toHaveBeenCalledWith('GPT-5 Thinking');
  });

  it('should call onClose when backdrop is pressed', () => {
    const onClose = jest.fn();
    render(<ChatModelModal {...defaultProps} onClose={onClose} />);

    expect(onClose).toBeDefined();
  });

  it('should highlight selected model', () => {
    const { getByText } = render(
      <ChatModelModal {...defaultProps} selectedModel='GPT-5 Thinking' />
    );

    expect(getByText('GPT-5 Thinking')).toBeTruthy();
  });

  it('should render empty when no models', () => {
    const { queryByText } = render(
      <ChatModelModal {...defaultProps} models={[]} />
    );

    expect(queryByText('GPT-5')).toBeNull();
  });
});
