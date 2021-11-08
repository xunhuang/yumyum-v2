import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const contributers = [
  { name: "April Schleck" },
  { name: "Snorri Gyfalson" },
  { name: "Yiming Luo" },
  { name: "Shawn Shihang Wang" },
  { name: "Zhen Zeng" },
  { name: "Ryan Pearl" },
  { name: "Helen Chan" },
  { name: "Peter Lin" },
  { name: "Shuo Shen" },
  { name: "Logan Wu" },
  { name: "Justin W" },
  { name: "Shuqin Ye" },
  { name: "Miaoqing Tan" },
  { name: "Ken Wu" },
  { name: "Shirley Sun" },
  { name: "tumbleshack@github" },
  { name: "Cat Chen" },
  { name: "Paul Menage" },
  { name: "Chris Benson" },
  { name: "YLuna" },
  { name: "Yuan Luna Feng" },
  { name: "hangongithub" },
  { name: "Mike Ratner" },
  { name: "Sabrina Chow" },
  { name: "Xun Wilson Huang" },
];

const useStyles = makeStyles((theme) => ({
  typography: {
    display: "block",
    padding: "1vh",
  },
}));

const CreditPopover = () => {
  const classes = useStyles();

  const list = contributers.map((element) => {
    return " " + element.name;
  });

  return (
    <Typography
      variant="body2"
      color="textSecondary"
      className={classes.typography}
    >
      {list.toString().substring(1, list.toString().length - 1)}
    </Typography>
  );
};

export default CreditPopover;
