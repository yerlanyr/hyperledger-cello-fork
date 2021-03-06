/*
 SPDX-License-Identifier: Apache-2.0
*/
import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Dropdown, Avatar, Divider, Button, Tooltip } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import styles from './index.less';
import { getLang } from '../../utils/utils';
import stackOverflow from '../../assets/so.svg';

const language = getLang();
export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  changeLanguage = () => {
    localStorage.setItem('language', language === 'en' ? 'zh-CN' : 'en');
    window.location.reload();
  };
  render() {
    const { collapsed, isMobile, logo, onMenuClick } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />Logout
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.header}>
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          <Tooltip title="Document">
            <a
              target="_blank"
              href="https://cello.readthedocs.io"
              rel="noopener noreferrer"
              className={styles.action}
              title="Document"
            >
              <Icon type="question-circle-o" />
            </a>
          </Tooltip>
          <Tooltip title="Stack Overflow">
            <a
              target="_blank"
              href="https://stackoverflow.com/questions/tagged/hyperledger-cello"
              rel="noopener noreferrer"
              className={styles.action}
              title="Stack Overflow"
            >
              <img src={stackOverflow} style={{ width: 18 }} />
            </a>
          </Tooltip>
          <Button size="small" onClick={this.changeLanguage}>
            {language === 'en' ? '??????' : 'En'}
          </Button>
          {window.username ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} icon="user" />
                <span className={styles.name}>{window.username}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
