import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Moment } from 'moment';
import PropTypes from 'prop-types';
import React, { ChangeEvent } from 'react';
import { isMobile } from 'react-device-detect';

const moment = require("moment");

const useStyles = makeStyles((theme) => ({
  mobileDiv: {},
  webDiv: {},
  container: {
    height: 35,
  },
}));

type DateRangeSliderProps = {
  startDate: Moment;
  currentDate: Moment;
  defaultValue: number;
  minOffset: number;
  valueChanged: (v: number) => void;
};

const DateRangeSlider = (props: DateRangeSliderProps) => {
  const classes = useStyles();
  // takes a start date, and current date
  //
  // reports an offset from currentdate (eg. current - start - value)

  const startDate = moment(props.startDate);
  const currentDate = moment(props.currentDate);
  const daysBetween = currentDate.diff(startDate, "days");

  let defaultValue =
    props.defaultValue !== undefined
      ? daysBetween - props.defaultValue
      : daysBetween - 30;
  defaultValue = defaultValue > -1 ? defaultValue : 0;

  const defaultMaxValue = daysBetween > 13 ? daysBetween - 14 : daysBetween;
  const maxValue =
    props.minOffset !== undefined
      ? daysBetween - props.minOffset
      : defaultMaxValue;

  const [valueState, setValueState] = React.useState(defaultValue);

  const constLabelFormat = (value: number) => {
    return moment(startDate).add(value, "days").format("MM/DD");
  };

  const handleValueChange = (value: number) => {
    if (value !== valueState) {
      setValueState(value);
      props.valueChanged(daysBetween - value);
    }
  };

  const marks = [
    { value: daysBetween - 30 > -1 ? daysBetween - 30 : daysBetween },
  ];

  const sliderPropsShared = {
    "aria-label": "Start Date",
    // track: false,
    "aria-labelledby": "discrete-slider",
    valueLabelFormat: constLabelFormat,
    step: 1,
    marks: marks,
    min: 0,
    max: maxValue,
    value: valueState,
    onChange: (event: ChangeEvent<{}>, value: number | number[]) =>
      handleValueChange(value as number),
  };

  return isMobile ? (
    <Grid
      container={true}
      direction="row"
      justifyContent="center"
      alignItems="flex-end"
      className={`${classes.mobileDiv} ${classes.container}`}
    >
      <IOSSlider {...sliderPropsShared} valueLabelDisplay={"off"} />
    </Grid>
  ) : (
    <Grid
      container={true}
      direction="row"
      justifyContent="center"
      alignItems="flex-end"
      className={`${classes.webDiv} ${classes.container}`}
    >
      <StyledSlider {...sliderPropsShared} valueLabelDisplay="auto" />
    </Grid>
  );
};

DateRangeSlider.propTypes = {
  currentDate: PropTypes.any.isRequired,
  startDate: PropTypes.any.isRequired,
  valueChanged: PropTypes.any.isRequired,
};

const StyledSlider = withStyles({
  root: {
    color: "#00aeef",
    height: 2,
    padding: "15px 0",
  },
  valueLabel: {
    left: "calc(-50% - 4px)",
  },
  thumb: {
    backgroundColor: "#3880ff",
  },
  mark: {
    backgroundColor: "#bfbfbf",
    height: 8,
    width: 1,
    marginTop: -3,
  },
})(Slider);

const iOSBoxShadow =
  "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";

const IOSSlider = withStyles({
  root: {
    color: "#00aeef",
    height: 2,
    padding: "15px 0",
  },
  thumb: {
    height: 28,
    width: 28,
    backgroundColor: "#fff",
    boxShadow: iOSBoxShadow,
    marginTop: -14,
    marginLeft: -14,
    "&:focus, &:hover, &$active": {
      boxShadow:
        "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 11px)",
    top: -22,
    "& *": {
      background: "transparent",
      color: "#000",
    },
  },
  track: {
    height: 2,
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: "#3880ff",
  },
  mark: {
    backgroundColor: "#bfbfbf",
    height: 8,
    width: 1,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
    backgroundColor: "currentColor",
  },
})(Slider);

export { DateRangeSlider };
