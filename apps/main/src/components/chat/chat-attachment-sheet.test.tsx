import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { mockColors } from '../../test/fixtures';
import ChatAttachmentSheet from './chat-attachment-sheet';

const mockAttachmentOptions = [
  { id: 'camera', label: '写真', icon: 'camera' as const },
  { id: 'files', label: 'すべてを表示する', icon: 'list' as const },
  { id: 'circle', label: '', icon: 'circle' as const },
];

describe('ChatAttachmentSheet', () => {
  const defaultProps = {
    colors: mockColors,
    visible: true,
    bottomInset: 34,
    options: mockAttachmentOptions,
    onClose: jest.fn(),
  };

  it('should render when visible', () => {
    const { getByText } = render(<ChatAttachmentSheet {...defaultProps} />);

    expect(getByText('写真')).toBeTruthy();
    expect(getByText('すべてを表示する')).toBeTruthy();
    expect(getByText('より長く思考する')).toBeTruthy();
    expect(getByText('エージェントモード')).toBeTruthy();
  });

  it('should not render when not visible', () => {
    const { queryByText } = render(
      <ChatAttachmentSheet {...defaultProps} visible={false} />
    );

    expect(queryByText('写真')).toBeNull();
  });

  it('should call onClose when option is pressed', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <ChatAttachmentSheet {...defaultProps} onClose={onClose} />
    );

    const option = getByText('写真');
    fireEvent.press(option);

    expect(onClose).toHaveBeenCalled();
  });

  it('should render action buttons', () => {
    const { getByText } = render(<ChatAttachmentSheet {...defaultProps} />);

    expect(getByText('より長く思考する')).toBeTruthy();
    expect(getByText('エージェントモード')).toBeTruthy();
  });

  it('should handle empty options', () => {
    const { queryByText, getByText } = render(
      <ChatAttachmentSheet {...defaultProps} options={[]} />
    );

    expect(queryByText('写真')).toBeNull();
    expect(getByText('より長く思考する')).toBeTruthy();
  });

  it('should apply correct bottom inset', () => {
    const { getByText } = render(
      <ChatAttachmentSheet {...defaultProps} bottomInset={50} />
    );

    expect(getByText('写真')).toBeTruthy();
  });
});
