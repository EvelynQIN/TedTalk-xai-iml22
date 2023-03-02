import React, {useState} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

//all components
import TreeMapComponent from './TreeMapComponent';
import StreamGraph from './StreamGraph';
import LineChart from './LineChart';
import ColorMap from './ColorMap';
import BarChart from './BarChart';

//all data
import treemapData from './Vis_data/treemap_data.json';
import streamData from './Vis_data/topic_strength_per_year.json';
import linechartData from './Vis_data/keyword_evolution.json';
import topiccolors from './Vis_data/topic_colors_stream.json';
import topic_embedding_data from "./Vis_data/topic_embeddings_over_time.json";
import detaildata from './Vis_data/talks_detail_info.json';
import topiccolorstree from "./Vis_data/topic_colors_for_tree.json";



function App() {
  

  const mdTheme = createTheme({
    palette: {
      primary: {
        main: "#e57373",  // change the background color of title
      }
    },
  });
  const [property, setProperty] = useState("topic_strength");
  const [year, setYear] = useState("2006");
  const [topic, setTopic] = useState("Music & Creativity");
  const [tid, setTid] = useState("Sirena Huang dazzles on violin");
  const getStreamData = (year, topic) => {
    setYear(year);
    setTopic(topic);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute">
          <Typography variant="h5" align="center" fontFamily = {'Raleway'}>
          Interactive Visual Analytics on TED Talk Trend
          </Typography>
        </AppBar>
        <Container maxWidth="xl" sx={{ mt: 6, mb: 6 }}>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <Paper sx={{
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 450,
                }}><b>Topic Flow - Rivers of topics from 2006 to 2012</b>
                        <select
                          name="topic_metric_selector"
                          value={property} 
                          width="120px"
                          onChange={event => setProperty(event.target.value)}>
                            <option value="topic_strength">topic strength -- average document probability</option>
                            <option value="topic_rank">topic coverage  -- integrated rank based on topic coverage and variance</option>
                            <option value="sentiment">positive ratio -- average ratio of positive comments</option>
                        </select>
                <StreamGraph data={streamData} property={property} topic_colors = {topiccolors} getStreamData = {getStreamData} ></StreamGraph>
                <Alert sx={{height: "50px", paddingBottom: 0, paddingTop: 0}} variant="outlined" severity="info"><b>Click the topic stream to check its keyword evolution and click the year
                  axis line to see the colormap & top 5 hot talks.</b></Alert>
              </Paper>
            </Grid>
            <Grid item xs = {4}>
              <Paper sx = {{
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                height: 450,
              }}>
                <b>Semantic colormap of topics in {year}</b>
                <ColorMap data = {topic_embedding_data} year = {year} colortheme = "bremm"></ColorMap>
                <Typography variant="caption" gutterBottom style={{position:'absolute', top:480, fontWeight: 'bold'}}>NB: Closer on the colormap -{'>'} More semantically similar</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 450,
                }}><b>Treemap on hot talks in {year}</b>
                <TreeMapComponent alldata={treemapData} year = {year} setTid = {setTid} colors = {topiccolorstree}></TreeMapComponent>
              </Paper>
            </Grid>
            <Grid item xs = {4}>
              <Paper sx = {{
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 450,
                }}>
                  <b>Details about talk <i>"{tid}"</i></b>
                  <BarChart tid = {tid} data = {detaildata} year = {year} colors = {topiccolorstree}></BarChart>
                  <Typography variant="caption" gutterBottom style={{position:'absolute', top:927, fontWeight: 'bold'}}>NB: Positive comment ratio is calculated based on sentiment analysis</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 450,
                }}><b>Evolution - top 10 keywords of <i>{topic}</i></b>
                <LineChart alldata={linechartData} topic = {topic}></LineChart>
              </Paper>
            </Grid>
            <Grid item xs = {4}>
              <Alert variant="outlined" severity="info">The color of each topic is extracted from the semantic colormap 
              and the area of each rectangle is proportional to the number of views of that topic/talk. <b>Click the topic to 
              find out the talks that belong to it and click the talk to explore its details. Click the top left corner to zoom out.</b>
              </Alert>
            </Grid>
            <Grid item xs = {4}>
              <Alert variant="outlined" severity="info">The bar chart shows the balance of topics of a specific talk and below it are
              more details of the talk. <b>Hover the mouse over <u>Read the description</u> to check the description of the talk and 
              click <u>Watch the full talk</u> to watch the original video.</b></Alert>
            </Grid>
            <Grid item xs = {4}>
              <Alert variant="outlined" severity="info">The line chart illustrates how the weights of top 10 keywords of a specific
              talk in 2006 change afterwards. The weight indicates how important each keyword is for a specific topic. <b>Hover the 
                mouse over the point to see the exact value of its weight.</b></Alert>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
    
  );
}

export default App;
