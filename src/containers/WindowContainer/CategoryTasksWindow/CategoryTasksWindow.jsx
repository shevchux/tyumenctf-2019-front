import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  setRenderOptions,
  setPayload,
  addTab,
  TabType,
} from "../../../actions/desktop";
import { Dir } from "../../../components/Dir/Dir";
import { DirIsland } from "../../../components/Dir/DirIsland/DirIsland";
import * as UI from "../../../components/UI";
import "./styles.scss";
import { DirHead } from "../../../components/Dir/DirHead/DirHead";
import { fetchCategoryTasks } from "../../../actions/tasks";
import { withTranslation } from "react-i18next";
import { TimesLeft } from "../../../components/TimesLeft/TimesLeft";

class CategoryTasksWindowContainer extends React.Component {
  componentDidMount() {
    const {
      firstRender,
      tabId,
      currentCategory,
      setRenderOptions,
    } = this.props;

    if (firstRender) {
      setRenderOptions(tabId, {
        firstRender: false,
        title: currentCategory.name,
        icon: currentCategory.icon,
        minSize: { height: 300, width: 650 },
        size: { height: 460, width: 750 },
        resizable: true,
      });
    }
  }

  changeCategory(category) {
    const { changeCategory, setRenderOptions, tabId } = this.props;
    changeCategory(tabId, category.id);
    setRenderOptions(tabId, { title: category.name, icon: category.icon });
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (this.props.currentCategory.name !== props.currentCategory.name) {
      props.setRenderOptions(props.tabId, {
        title: props.currentCategory.name,
      });
    }
  }

  render() {
    const {
      categoryTasks,
      categories,
      currentCategory,
      openTask,
      refreshCategory,
      t,
    } = this.props;
    const tasksCount = categoryTasks.length;
    const solvedTasksCount = categoryTasks.filter(task => task.solved).length;

    return (
      <Dir>
        <Dir.Head>
          <DirHead
            path={"SERV://TyumenCTF/2019/Tasks/" + currentCategory.name}
            loading={currentCategory.loading}
            status={
              currentCategory.loading ? (
                <span>{t("w-dir.refresh-loading")}</span>
              ) : (
                <span>
                  {t("w-dir.refresh-loaded")}{" "}
                  <TimesLeft time={currentCategory.loaded} />
                </span>
              )
            }
            onClick={() => refreshCategory(currentCategory.id)}
          />
        </Dir.Head>
        <Dir.Left>
          <DirIsland title={t("w-category.list-title")}>
            <ul className="task-window-catlist">
              {categories.map(category => (
                <li
                  key={category.id}
                  className="task-window-catitem"
                  onClick={() => this.changeCategory(category)}
                >
                  <UI.Icon id={category.icon} small />
                  {category.id === currentCategory.id ? (
                    <strong>{category.name}</strong>
                  ) : (
                    <span>{category.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </DirIsland>
          <DirIsland title={t("w-category.cat-info.title")}>
            <p>
              <strong>{currentCategory.name}</strong>
              <br />
              <span>{t("w-category.cat-info.subtitle")}</span>
            </p>
            <p>
              <span>
                {t("w-category.cat-info.tasksCount")} {tasksCount}
              </span>
              {tasksCount !== 0 && (
                <React.Fragment>
                  <br />
                  <span>
                    {t("w-category.cat-info.tasksSolved")} {solvedTasksCount} (
                    {Math.round((solvedTasksCount / tasksCount) * 1000) / 10}
                    %)
                  </span>
                </React.Fragment>
              )}
            </p>
          </DirIsland>
        </Dir.Left>
        <Dir.Right>
          <table
            cellPadding="0"
            cellSpacing="0"
            border="0"
            className="tasks-list-table noselect"
          >
            <thead>
              <tr>
                <th>{t("w-category.table.name")}</th>
                <th>{t("w-category.table.price")}</th>
                <th>{t("w-category.table.status")}</th>
                <th>{t("w-category.table.teamsSolved")}</th>
              </tr>
            </thead>
            <tbody>
              {categoryTasks.map(task => (
                <tr
                  key={task.id}
                  onDoubleClick={() => openTask(task.id)}
                  tabIndex="1"
                >
                  <td style={{ maxWidth: 200 }}>
                    <UI.Icon
                      id={task.solved ? "task-solved" : "task"}
                      small
                      className="tasks-list-table-icon"
                    />
                    {task.name}
                  </td>
                  <td style={{ width: 70 }}>{task.price}</td>
                  <td style={{ width: 100 }}>
                    {task.solved
                      ? t("w-category.table.labels.solved")
                      : t("w-category.table.labels.not-solved")}
                  </td>
                  <td>{task.solvedCount}</td>
                </tr>
              ))}
              <tr>
                <td />
              </tr>
            </tbody>
          </table>
        </Dir.Right>
      </Dir>
    );
  }
}

CategoryTasksWindowContainer.propTypes = {
  setRenderOptions: PropTypes.func,
  changeCategory: PropTypes.func,
  tabId: PropTypes.number,
  currentCategory: PropTypes.shape({}),
  categories: PropTypes.arrayOf(PropTypes.shape({})),
  categoryTasks: PropTypes.arrayOf(PropTypes.shape({})),
  firstRender: PropTypes.bool,
  refreshCategory: PropTypes.func,
  openTask: PropTypes.func,
  t: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  currentCategory: state.tasks.categories.find(
    category => category.id === ownProps.categoryId
  ),
  categoryTasks: state.tasks.items.filter(
    task => task.categoryId === ownProps.categoryId
  ),
  categories: state.tasks.categories,
  firstRender: state.desktop.tabs.find(tab => tab.id === ownProps.tabId).render
    .firstRender,
});

const mapDispatchToProps = dispatch => ({
  setRenderOptions: (id, renderOptions) =>
    dispatch(setRenderOptions(id, renderOptions)),
  changeCategory: (id, categoryId) => dispatch(setPayload(id, { categoryId })),
  openTask: taskId => dispatch(addTab(TabType.TASK, { taskId })),
  refreshCategory: categoryId => dispatch(fetchCategoryTasks(categoryId)),
});

export const CategoryTasksWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(CategoryTasksWindowContainer));
