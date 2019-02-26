import React, { Component } from "react";
import "./App.css";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import CustomInput from "./CustomInput";
import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Grid from "@material-ui/core/Grid";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
      main: "#cddc39"
    }
  }
});
const styles = theme => ({
  toobar: {
    justifyContent: "center"
  },
  chart: {
    marginTop: "20px"
  }
});

class App extends Component {
  state = {
    check: false,
    input: "",
    metrics: []
  };
  handleSwitch() {
    if (this.state.check === false) {
      fetch(this.state.input)
        .then(r => {
          if (r.status === 200) {
            return r.json();
          } else {
            throw new Error("Not success code");
          }
        })
        .then(response => {
          this.setState(state => {
            let metrics =
              state.metrics.length === 20
                ? state.metrics.slice(1, 21)
                : state.metrics;
            return {
              check: !state.check,
              metrics: [...metrics, response]
            };
          });
        })
        .catch(() => this.setState({ check: false }));
    } else {
      this.setState(state => {
        return {
          check: !state.check
        };
      });
    }
  }
  componentDidUpdate() {
    if (this.state.check) {
      setTimeout(() => {
        fetch(this.state.input)
          .then(r => {
            if (r.status === 200) {
              return r.json();
            } else {
              throw new Error("Not success code");
            }
          })
          .then(response => {
            this.setState(state => {
              let metrics =
                state.metrics.length === 20
                  ? state.metrics.slice(1, 21)
                  : state.metrics;
              return {
                metrics: [...metrics, response]
              };
            });
          })
          .catch(() => this.setState({ check: false }));
      }, 1000);
    }
  }
  render() {
    const { classes } = this.props;
    const { check, input, metrics } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <AppBar position="static">
            <Toolbar className={classes.toobar}>
              <CustomInput
                disabled={check}
                onChange={e => this.setState({ input: e.target.value })}
                value={input}
              />
              <Switch
                checked={check}
                onChange={this.handleSwitch.bind(this)}
                value="checkedB"
                color="secondary"
              />
            </Toolbar>
          </AppBar>
          <Grid container spacing={24}>
            <Grid item xs={6} className={classes.chart}>
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  title: {
                    text: "CPU"
                  },
                  series: [
                    {
                      data: metrics.map(m =>
                        Number(m.process.cpu.usage.toFixed(3))
                      )
                    }
                  ],
                  credits: {
                    enabled: false
                  }
                }}
              />
            </Grid>
            <Grid item xs={6} className={classes.chart}>
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  title: {
                    text: "Memory"
                  },
                  series: [
                    {
                      name: "rss",
                      data: metrics.map(m => m.process.memory.usage.rss)
                    },
                    {
                      name: "heapUsed",
                      data: metrics.map(m => m.process.memory.usage.heapUsed)
                    },
                    {
                      name: "heapTotal",
                      data: metrics.map(m => m.process.memory.usage.heapTotal)
                    },
                    {
                      name: "external",
                      data: metrics.map(m => m.process.memory.usage.external)
                    }
                  ],
                  credits: {
                    enabled: false
                  }
                }}
              />
            </Grid>
            <Grid item xs={6} className={classes.chart}>
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  title: {
                    text: "EventLoop"
                  },
                  series: [
                    {
                      name: "max",
                      data: metrics.map(m => m.process.eventLoop.latency.max)
                    },
                    {
                      name: "min",
                      data: metrics.map(m => m.process.eventLoop.latency.min)
                    },
                    {
                      name: "num",
                      data: metrics.map(m => m.process.eventLoop.latency.num)
                    },
                    {
                      name: "sum",
                      data: metrics.map(m => m.process.eventLoop.latency.sum)
                    }
                  ],
                  credits: {
                    enabled: false
                  }
                }}
              />
            </Grid>
            <Grid item xs={6} className={classes.chart}>
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  title: {
                    text: "Run"
                  },
                  series: [
                    {
                      name: "activeRequests",
                      data: metrics.map(m => m.process.run.activeRequests)
                    }
                  ],
                  credits: {
                    enabled: false
                  }
                }}
              />
            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
