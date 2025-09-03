import { Button, Spin } from 'antd';

export const Loading = () => {

  return (
    <span>
      <Spin size="large" />
      <Button
        type="primary"
        size="large"
        style={{
          background: "red",
          borderColor: "red",
          fontWeight: "bold",
          marginRight: "5px",
        }}
        href="/"
      >
        Michelin Reservations Made Easy
      </Button>
    </span>
  );
};
