import React from 'react';
import {
  Card as MCard,
  CardProps,
  CardContent,
  CssBaseline,
  ThemeProvider,
  Typography,
} from '@mui/material';
import theme from '../theme';
import Button from '../Button';
import { ExpirationExpired, ExpirationNotExpired, Submission } from '../Icons';
import useStyles from './RewardCard.styles';

export interface RewardCardProps extends CardProps {
  description: React.ReactNode;
  reward: string;
  expiration?: string;
  submissions?: number;
  onClickText?: string | undefined;
  onClickButton?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  dataList?: JSX.Element;
  isActive: boolean;
  isInfinite: boolean;
}

const RewardCard = ({
  title,
  description,
  onClickButton,
  onClickText,
  reward,
  expiration,
  submissions,
  dataList,
  isActive,
  isInfinite,
}: RewardCardProps) => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MCard
        className={[classes.root, 'reward-card'].join(' ')}
        elevation={0}
        variant='outlined'
      >
        <CardContent
          className={[classes.content, 'reward-card-content'].join(' ')}
        >
          <div className={[classes.main, 'reward-card-main'].join(' ')}>
            <div
              className={[classes.informationCard, 'reward-card-info'].join(
                ' '
              )}
            >
              <Typography variant='h5' color='primary' fontWeight='700' mb={1}>
                <span
                  className={[
                    classes.dot,
                    isActive ? classes.active : classes.inactive,
                  ].join(' ')}
                />
                {title}
              </Typography>

              <Typography
                variant='body2'
                color='primary'
                component='div'
                style={{ flex: 1 }}
              >
                {description}
              </Typography>

              <div className={classes.iconContainer}>
                <div className={classes.iconContent}>
                  <span className={classes.icon}>
                    {isInfinite ? (
                      <ExpirationExpired />
                    ) : (
                      <ExpirationNotExpired />
                    )}
                  </span>
                  <Typography variant='body2' color='textSecondary'>
                    {expiration}
                  </Typography>
                </div>
                <div className={classes.iconContent}>
                  <span className={classes.icon}>
                    <Submission />
                  </span>
                  <Typography variant='body2' color='textSecondary'>
                    {submissions} submissions
                  </Typography>
                </div>
              </div>
            </div>
            <div
              className={[classes.actionCard, 'reward-card-action'].join(' ')}
            >
              <Typography color='primary' variant='body1'>
                Reward:
              </Typography>
              <div className={classes.rewardContent}>{reward}</div>
              <Button
                disableElevation
                color='secondary'
                onClick={onClickButton}
                disabled={!onClickButton}
                variant='contained'
                label={onClickText}
                size='medium'
                fullWidth
              />
            </div>
          </div>
          {dataList && (
            <div className={classes.dataListContainer}>{dataList}</div>
          )}
        </CardContent>
      </MCard>
    </ThemeProvider>
  );
};

export default RewardCard;
