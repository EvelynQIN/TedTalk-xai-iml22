# Interactive Visual Analytics on Ted Talks

## Team Members
1. Yaqi Qin
2. Tianyang Xu
3. Tianyi Liu
4. Aojie Yu

## Project Description 
### Users
- TED foundation & event holders
    * Keep track of hot topics over time
    * Discover possible factors for a popular talk to attract audiences
- Social science researchers
    * Analyze public attention and topic competitiveness

### Datasets
The datset contains all the TED talks downloaded from the official TED website, http://www.ted.com, on April 27th 2012 (first version) and on September 10th 2012 (second version), which can be downloaded from [here](https://zenodo.org/record/4061423#.YkGiFf7P0dU).

The dataset contains two main entry types: talks and users. The talks have the following data fields: identifier, title, description, speaker name, TED event at which they were given, transcript, publication date, filming date, number of views. Each talk has a variable number of user comments, organized in threads. In addition, three fields were assigned by TED editorial staff: related tags, related themes, and related talks. Each talk generally has three related talks and 95% of them have a high-quality transcript available. The dataset includes 1,149 talks from 960 speakers and 69,023 registered users that have made about 100,000 favorites and 200,000 comments.
 
### Tasks
- Identify hot topics and study how they evolve over time
- Identify hot talks for selected topics 
- Identify most important keywords and study how they evolve over time
- Analyze topic correlation

- - -
## Folder Structure
``` bash
├── README.md  
├── backend-project
│   ├── LDA_Topic_modelling 
│   │   ├── LDA_models   
│   │   ├── LDA_topic_modelling.ipynb
│   │   ├── Metrics_computation.ipynb   # compute the metrics used for visualization
│   │   └── dtm_lda.ipynb   # train the dynamic lda model
│   ├── data
│   │   ├── cleaned_data   # store two types of the dataset in two formats after data cleaning
│   │       ├── talks.csv
│   │       ├── talks.json
│   │       ├── users.csv  
│   │       └── users.json
│   │   └── original_data    # original talk data
│   │       ├── ted_talks-10-Sep-2012.json 
│   │       └── ted_talks-25-Apr-2012
│   ├── pydantic_models
│       └── example_data_points.py
│   ├── Processing.ipynb    # extract features from talks and construct topic derivation network
│   ├── Clean_Sentiment.ipynb    # perform basic data cleaning and sentiment analysis on comments
│   └── app.py
├── node_modules
├── react-frontend
│   ├── README.md
│   ├── public
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── Vis_data
│   │   │   ├── keyword_evolution.json    # data for line chart which shows the evolution of keywords for each topic
│   │   │   ├── talks_detail_info.json    # data for histogram chart 
│   │   │   ├── topic_colors.json    # map topics to a 2D colormap (grouped by topic)
│   │   │   ├── topic_colors_for_tree.json    # map topics to a 2D color map (grouped by year)
│   │   │   ├── topic_embeddings_over_time.json    # 2D representation of topics
│   │   │   ├── topic_strength_per_year.json    # data for stream graph
│   │   │   └── treemap_data.json    # data for treemap    
│   │   ├── App.js    # main app
│   │   ├── ColorMap.js    # main component for colormap
│   │   ├── BarChart.js    # main component for bar chart
│   │   ├── StreamGraph.js    # main component for stream graph
│   │   ├── TreeMapComponent.js    # main component for treemap
│   │   ├── LineChart.js    # main component for line chart
│   │   ├── uid.js      # sub component for treemap 
│   │   ├── getStreamColor.ipynb      # get colors from color map
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   └── reportWebVitals.js
├── package-lock.json
├── package.json
└── requirements.txt
```

## Requirements
Have npm and d3 installed.
Run `npm install @mui/material @emotion/react @emotion/styled` to install MUI.

## How to Run
Change into the `react-frontend` directory and run `npm start`.

## Milestones
- [x] Week 6
  - [x] Completed Sub-task: LDA topic modelling and topic strength metrics computation (see issue [here](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/TedTalk-xai-iml22/-/issues/1))
  - [x] Completed Sub-task: Create a stacked stream graph to depict topic strength evolution over time (see issue [here](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/TedTalk-xai-iml22/-/issues/2))

- [x] Week 9 (Easter week)
  - [x] Completed Sub-task: Sentiment analysis for users' comments
  - [x] Completed Sub-task: Train a dynamic LDA model
  - [x] Completed Sub-task: Come up with three quantitative metrics to measure topic strength over time
  - [x] Completed Sub-task: Added hover and select to the stream graph
  - [x] Completed Sub-task: Build a zoomable treemap with year-topic-keyword-hot videos hierarchy, with toy data of 2012
  - [x] Completed Sub-task: Draw a line chart with the change of importance over years of top 5 keywords of topic 8 (we plan to add interaction together with the stream graph for a timeline filter)

- [x] Week 10
  - [x] Completed Sub-task: Encode two-dimensional topic information with color based on a 2D colormap
  - [x] Completed Sub-task: Use Bayesian hierarchical clustering for topic evolution analysis 

- [x] Week 12
  - [x] Completed Sub-task: Train HDP to automatically determine appropriate number of topics, and use the output topic distribution as the prior of the dynamic LDA to model evolution of topic over time
  - [x] Completed Sub-task: Apply TSNE to vocab distribution of all topics to get 2d vector representations, and project each topic onto the colormap to visualize semantic similarity among all topics
  - [x] Completed Sub-task: Use the colormap to color streamgraph (each layer is a color gradient over time), treemap view and the talk-details view
  - [x] Completed Sub-task: Add interactivitiy among components: 
    - [x] StreamGraph: hover to show topic name and keywords, click to change Colormap, Treemap, and Linechart
    - [x] Treemap: click the block to zoomin & zoomout; click the talk  block to show its detailed view

- [x] Week 14
    - [x] Tune the topic models to generate reasonable topic distribution
    - [x] Adjust visual details and interaction glitches


## Versioning
Tags:
- Week 6: [Week 6 Tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/TedTalk-xai-iml22/-/tags/Week6)
- Week 9: [Week 9 Tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/TedTalk-xai-iml22/-/tags/Week9)
- Week 12: [Week 12 Tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/TedTalk-xai-iml22/-/tags/Week12)
- Week 14: [FinalSubmission](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/TedTalk-xai-iml22/-/tags/FinalSubmission)
