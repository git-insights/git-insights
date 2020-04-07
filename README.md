
<p align="center">
  <img src="https://raw.githubusercontent.com/git-insights/git-insights/master/.github/logo.png" />
</p>
<p align="center">
  <i>An open analytics tool to give you insights on your software projects and teams built using React and Node.js.<br/>Try out Git Insights using our hosted version at <a href="https://www.gitinsigts.io">www.gitinsigts.io</a>.</i>
  <br/>
  <img src="https://github.com/git-insights/git-insights/blob/401bea30ad3a4cb100855dac3bd8329fef6c46b8/.github/screenshot.png" alt="GitInsights" width="800" />
</p>

# Git Insights (Community Edition)

Git Insights is an analytics tool to give you insights on your software projects and teams. You can collect and analyze all your commits, pull requests, and issues, without sending the data to 3rd party services.

## Metrics We Care About

### Activity Dates and Time (Dashboard)
Individuals engage in activities in open source projects at various times of the day. This metric is aimed at determining the dates and times of when individual activities were completed.

### Time to First Response (Dashboard)
For an open-source project, the first response to an activity can sometimes be the most important response. The first response shows that a community is active and engages in conversations. Engagement is not only important for open source projects but is crucial for closed-source projects as well.

### Contributors (Dashboard)
A contributor is defined as anyone who contributes to the project in any way. This metric ensures that all types of contributions are fully recognized in the project. Similar to [All Contributors](https://allcontributors.org/) spec.

### Code Changes (Code)
Changes to the source code during a certain period, shown by the number of commits.

### Code Changes Line (Code)
This metric considers the aggregated number of lines touched by changes to the source code performed during a certain period. Displayed as Additions and Deletions for convenience.

### Reviews Accepted (Reviews)
Accepted reviews can be linked to one or more changes to the source code, those corresponding to the changes proposed and finally merged.

### Reviews Declined (Reviews)
Declined reviews are those that are finally closed without being merged into the code base of the project.

### Review Duration (Reviews)
The review duration is the duration of the period since the code review started, to the moment it ended. (Applies only to Accepted Code Reviews) The lower, the better.

### New Issues (Issues)
An issue can go through several states (for example, "triaged", "working", "fixed", "won't fix"), or being tagged with one or more tags, or be assigned to one or more persons. A constant stream of new issues is considered healthy.

### Active Issues (Issues)
Issues showing some activity are those that had some comment, or some change in state (including closing the issue), during a certain period. Useful for figuring out the momentum of the team on issues.

### Closed Issues (Issues)
This metric is an indication of how fast the team is able to get through the issues. Keep in mind that closed issues can be reopened after they are closed. Reopening an issue can be considered as opening a new issue, or making void the previous close.

### Issue Age (Issues)
This metric is an indication of how long issues have been left open in the considered time period. If an issue has been closed but re-opened again within that period it will be considered as having remained open since its initial opening date.

### Issue Response Time (Issues)
This metric is an indication of how much time passes between the opening of issues and a response from other contributors.

### Issue Resolution Duration (Issues)
This metric is an indication of how long an issue remains open, on average, before it is closed. For issues that were reopened and closed again, only the last close date is relevant for this metric.

## Philosophy

It is really hard to tell if a project is healthy and making solid progress by just looking at a single metric. We provide the missing analytics backend so that both open & close source projects move in the right direction.

We also understand that giving access to your source code is a scary thing (especially if you're working on a closed-source project). That's why we not only give you the option to self-host but also release as much of our code as possible.

## Open Source / Paid

This repo is entirely [MIT licensed](/LICENSE). In the future, we will charge for things like multi-tenant, team performance, and support.
