import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import Speed from '@mui/icons-material/Speed';
import "./speedslider.css";

const Input = styled(MuiInput)`
  width: 65px;
`;

const MAX = 0.99;
const MIN = 0.25;

export default function InputSlider({ value, setValue }) {

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? 0 : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0.25) {
            setValue(0.25);
        } else if (value > 0.99) {
            setValue(0.99);
        }
    };

    return (
        <Box sx={{ width: 300 }}>
            <Typography id="input-slider-desc" gutterBottom>
                Speed
            </Typography>
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                <Grid item>
                    <Speed sx={{ color: "#fbe4d1" }}/>
                </Grid>
                <Grid item xs>
                    <Slider
                        sx={{
                            color: "#fbe4d1"
                        }}
                        value={typeof value === 'number' ? value : 0}
                        min={MIN}
                        max={MAX}
                        step={0.01}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider-desc"
                    />
                </Grid>
                <Grid item>
                    <Input
                        id="speed-value"
                        value={value}
                        size="small"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: .01,
                            min: .25,
                            max: .99,
                            type: 'number',
                            'aria-labelledby': 'input-slider-desc',
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
