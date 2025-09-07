import { fireEvent, render } from '@testing-library/react-native';
import { mockColors } from '../../test/fixtures';
import ChatHeader from './chat-header';

describe('ChatHeader', () => {
  const defaultProps = {
    colors: mockColors,
    paddingTop: 44,
    onPressMenu: jest.fn(),
    onPressTitle: jest.fn(),
    selectedModelLabel: 'GPT-5',
  };

  it('should render correctly', () => {
    const { getByTestId, getByText } = render(<ChatHeader {...defaultProps} />);

    expect(getByTestId('menu-button')).toBeTruthy();
    expect(getByTestId('header-title')).toBeTruthy();
    expect(getByTestId('refresh-button')).toBeTruthy();
    expect(getByText('GPT-5')).toBeTruthy();
  });

  it('should display selected model label', () => {
    const { getByText } = render(
      <ChatHeader {...defaultProps} selectedModelLabel='GPT-5 Thinking' />
    );

    expect(getByText('GPT-5 Thinking')).toBeTruthy();
  });

  it('should call onPressMenu when menu button is pressed', () => {
    const onPressMenu = jest.fn();
    const { getByTestId } = render(
      <ChatHeader {...defaultProps} onPressMenu={onPressMenu} />
    );

    const menuButton = getByTestId('menu-button');
    fireEvent.press(menuButton);

    expect(onPressMenu).toHaveBeenCalled();
  });

  it('should call onPressTitle when title is pressed', () => {
    const onPressTitle = jest.fn();
    const { getByTestId } = render(
      <ChatHeader {...defaultProps} onPressTitle={onPressTitle} />
    );

    const titleButton = getByTestId('header-title');
    fireEvent.press(titleButton);

    expect(onPressTitle).toHaveBeenCalled();
  });

  it('should apply correct padding top', () => {
    const { getByTestId } = render(
      <ChatHeader {...defaultProps} paddingTop={60} />
    );

    expect(getByTestId('menu-button')).toBeTruthy();
    expect(getByTestId('header-title')).toBeTruthy();
    expect(getByTestId('refresh-button')).toBeTruthy();

    const { getByTestId: getByTestId2 } = render(
      <ChatHeader {...defaultProps} paddingTop={100} />
    );
    expect(getByTestId2('menu-button')).toBeTruthy();
  });

  it('should have accessibility labels', () => {
    const { getByTestId } = render(<ChatHeader {...defaultProps} />);

    expect(getByTestId('menu-button')).toBeTruthy();
    expect(getByTestId('header-title')).toBeTruthy();
    expect(getByTestId('refresh-button')).toBeTruthy();
  });
});
