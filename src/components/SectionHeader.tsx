import { makeStyles } from "@material-ui/core/styles";

type Props = {};

const useStyles = makeStyles((theme) => ({
  sectionHeader: {
    "border-left": `.1rem solid ${theme.palette.secondary.main}`,
    "border-bottom": ".1rem solid #f3f3f3",
    margin: 3,
    padding: 3,
  },
}));

const SectionHeader: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.sectionHeader}>{children}</div>;
};

export { SectionHeader };
