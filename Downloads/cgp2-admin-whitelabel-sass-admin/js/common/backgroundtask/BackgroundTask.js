/**
 * @Description:
 * @author nan
 * @date 2022/6/27
 */
Ext.Loader.syncRequire([
    'CGP.common.backgroundtask.Task'
])
Ext.define('CGP.common.backgroundtask.BackgroundTask', {
    extend: 'Ext.Component',
    alias: 'widget.backgroundtask',
    width: 250,
    height: 22,
    store: null,
    allowRetry: false,
    taskGridCfg: null,//任务列表的默认配置
    deleteBtnCfg: null,
    refreshBtnCfg: null,

    initComponent: function () {
        var me = this;
        var uuId = JSGetUUID();
        me.renderTpl = new Ext.XTemplate(
            '<div style="height: 22px;">',
            '<div id=' + uuId + ' class="out-progress"  vertical-align: middle;">',
            '</div>',
            '</div>',
            {
                //这里可以配置应用到模板中的配置，作用跟renderData类似
            }
        );
        me.callParent(arguments);
        me.on('boxready', function (me) {
            var ProgressBarDiv = document.getElementById(uuId);
            me.progressBar = Ext.create('Ext.ProgressBar', {
                renderTo: ProgressBarDiv,
                flex: 1,
                value: 1,
                height: 22,
                text: '<font  style="vertical-align: middle;"color="yellow">运行中：0</font>' +
                    ' | <font style="vertical-align: middle;"color="green">成功：0</font>' +
                    ' | <font  style="vertical-align: middle;"color="red">失败：0</font>'

            });
            me.buildMenu();
        });
        me.on('statuschange', function (task, status, rate) {
            me.updateTaskStatus(...arguments);
        });
        me.store = me.store || Ext.create('CGP.common.backgroundtask.store.BackgroundTaskStore', {
            data: []
        });
    },
    buildMenu: function () {
        var me = this;
        me.relayEvents(me.store, ['add', 'update', 'clear', 'remove']);
        me.menu = Ext.create('Ext.grid.Panel', Ext.Object.merge({
            floating: true,
            width: me.width,
            store: me.store,
            deleteBtnCfg: null,//删除功能配置
            refreshBtnCfg: null,//刷新功能配置
            extraColumns: null,//额外的列配置
            viewConfig: {
                markDirty: false,
            },
            columns: [
                {
                    xtype: 'rownumberer',
                    tdCls: 'vertical-middle',
                },
                {
                    width: 70,
                    xtype: "componentcolumn",
                    itemId: 'action',
                    renderer: function (value, metaData, record, row, col, store, view) {
                        var status = record.get('status');
                        var menu = view.ownerCt;
                        return {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                Ext.Object.merge({
                                    xtype: 'button',
                                    iconCls: 'icon_remove icon_margin',
                                    tooltip: '删除',
                                    componentCls: 'btnOnlyIcon',
                                    itemId: 'delete',
                                    disabled: status == 'waiting',
                                    handler: function (btn) {
                                        Ext.Msg.confirm('提示', '确定删除？', callback);

                                        function callback(id) {
                                            if (id === 'yes') {
                                                store.remove(record);
                                            }
                                        }
                                    }
                                }, menu.deleteBtnCfg),
                                Ext.Object.merge({
                                    xtype: 'button',
                                    iconCls: 'icon_refresh icon_margin',
                                    tooltip: '重试',
                                    componentCls: 'btnOnlyIcon',
                                    itemId: 'redo',
                                    hidden: status == 'waiting',
                                    handler: function (btn) {
                                        btn.hide();
                                        btn.ownerCt.getComponent('delete').setDisabled(true);
                                        record.get('task').redo();
                                    }
                                }, menu.refreshBtnCfg),
                            ]
                        }
                    }
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'title',
                    flex: 1,
                    itemId: 'title',
                    renderer: function (value, metaData, record, row, col) {
                        var me = this;
                        metaData.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: '进度',
                    xtype: "componentcolumn",
                    dataIndex: 'taskDetail',
                    itemId: 'waiting',
                    renderer: function (taskDetail, metaData, record) {
                        var status = record.get('status');
                        var me = this;
                        return {
                            xtype: 'progressbar',
                            animate: true,
                            text: Math.ceil(taskDetail.rate * 100) + '%',
                            value: taskDetail.rate || 0,
                            renderTpl: [
                                '<tpl if="internalText">',
                                '<div class="{baseCls}-text {baseCls}-text-back">{text}</div>',
                                '</tpl>',
                                '<div id="{id}-bar" class="{baseCls}-bar {baseCls}-bar-' + (status == 'failure' ? 'failure' : 'waiting') + '" style="width:{percentage}%">',
                                '<tpl if="internalText">',
                                '<div class="{baseCls}-text">',
                                '<div>{text}</div>',
                                '</div>',
                                '</tpl>',
                                '</div>'
                            ],
                        }
                    }
                },
                {
                    xtype: 'atagcolumn',
                    width: 150,
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    getDisplayName: function (value, metadata, record) {
                        if (value == 'failure') {
                            return i18n.getKey(value) + '  <a href="#">错误信息</a>';
                        } else {
                            return i18n.getKey(value);
                        }

                    },//自定义显示的内容的方法
                    clickHandler: function (value, metadata, record) {
                        var task = record.get('task');
                        JSShowJsonData(task.result.failureDesc, '错误信息');
                    }
                }
            ].concat(me.taskGridCfg?.extraColumns || []),
            maxHeight: 250,
            owner: me,
        }, me.taskGridCfg));
        //点击其他位置时隐藏
        document.body.onclick = function (event) {
            var me = this;
            var evt = event.srcElement ? event.srcElement : event.target;
            var el = document.getElementsByClassName('out-progress')[0];
            var menu = me.menu;
            if (menu.rendered == true) {
                if (el.contains(evt)
                    || evt.id == 'menu' || me.menu.el.dom.contains(evt)
                    || evt.tagName == 'IMG' || evt.id.indexOf('button') != -1) {
                } else {
                    me.menu.hide();
                }
            }
        }.bind(me);
        //窗口大小改变时
        Ext.EventManager.onWindowResize(me.setMenuPosition, me);
        //绑定store的事件和对应的监听,
        me.on('add', me.onUpdate);
        me.on('remove', me.onUpdate);
        me.on('clear', me.onUpdate);
        me.on('update', me.onUpdate);
        me.el.on('mouseover', me.showMenu, me);
        me.el.on('click', me.showMenu, me);
    },
    showItemDetail: function (record) {
        var me = this;
        var data = record.get('taskDetail');
        i18n.getKey('starttime')
        var showData = {
            '开始时间': data.beginTime,
            '结束时间': data.endTime,
            '数量': data.idCount,
            '请求Id列表': data.idArray,
            '请求配置': data.requestConfig
        };
        if (data.errorInfo) {
            if (data.errorId) {
                showData['出错Id'] = data.errorId;
            }
            showData['错误信息'] = data.errorInfo;
        }
        var win = Ext.widget('showjsondatawindow', {
            id: JSGetUUID(),
            modal: true,
            rawData: showData,
            title: '任务详情',
            showValue: true,
            bbar: [
                '->', {
                    xtype: 'button',
                    text: i18n.getKey('重试'),
                    tooltip: '重新发送请求',
                    iconCls: 'icon_refresh',
                    disabled: record.get('taskDetail').taskStatus,
                    handler: function (view) {
                        if (record.get('taskDetail').taskStatus) {
                            return;
                        }
                        me.doRequestForArray(record.get('requestConfig'), record.get('idArray'), record.get('title'), record);
                        win.close();
                    }
                }
            ]
        });
        win.show();
    },
    setMenuPosition: function (x, y) {
        var me = this;
        var outProgress = me.el;
        var x = outProgress.getXY()[0];
        var y = outProgress.getXY()[1] + 23;
        var clientWidth = document.body.clientWidth;
        if (x + me.menu.width > clientWidth) {
            x = clientWidth - me.menu.width - 5;
        }
        me.menu.setPosition(x, y);
    },
    showErrorInfo: function (record) {
        var errorMessage = record.get('taskDetail').errorInfo.data.message
        Ext.Msg.alert('报错信息', errorMessage)
    },
    showMenu: function () {
        var me = this;
        me.setMenuPosition();
        me.menu.show();
        var doc = Ext.getDoc();
        doc.on('mousewheel', me.hideMenu, me);
        doc.on('mousedown', me.hideMenu, me);
        me.menu.getView().refresh();
    },
    /**
     * 指定某些情况下需要隐藏任务菜单
     * @param e
     */
    hideMenu: function (e) {
        var me = this;
        if (!me.isDestroyed && !e.within(me.bodyEl, false, true) && !e.within(me.menu.el, false, true) && !e.within(Ext.Msg.el, false, true)) {
            var doc = Ext.getDoc();
            doc.un('mousewheel', me.hideMenu, me);
            doc.un('mousedown', me.hideMenu, me);
            me.menu.hide();
        }
    },
    /**
     * 更新位置
     * @param ds
     * @param record
     */
    onUpdate: function (ds, record) {
        var me = this;
        setTimeout(function () {
            me.setMenuPosition();
        }, 100);
        var successCount = 0;
        var failureCount = 0;
        var processingCount = 0;
        me.store.data.items.forEach(function (item) {
            successCount += (item.get('status') == 'success');
            failureCount += (item.get('status') == 'failure');
            processingCount += (item.get('status') == 'waiting');
        });
        me.progressBar.updateText(`<font  style="vertical-align: middle;" color="yellow">运行中：${processingCount}</font>` +
            ` | <font style="vertical-align: middle;" color="green">成功：${successCount}</font>` +
            ` | <font  style="vertical-align: middle;" color="red">失败：${failureCount}</font>`);
        if (processingCount > 0) {
            me.progressBar.isWaiting() ? null : me.progressBar.wait({
                interval: 500, //bar will move fast!
                duration: 50000,
                increment: 15,
                text: 'Updating...',
                scope: this,
            });
            /*
                        me.progressBar.textEl.addCls('background_task_animation');
            */
        } else {
            me.progressBar.reset();
            me.progressBar.updateProgress(1);
            /*
                        me.progressBar.textEl.removeCls('background_task_animation');
            */
        }
    },
    /**
     * 添加任务
     */
    addTask: function (task) {
        var me = this;
        task.start();
        me.relayEvents(task, ['statuschange']);
        me.store.add({
            taskId: task.taskId,
            title: task.title || '异步任务',
            count: 10,
            task: task,
            buildTaskFun: task.buildTaskFun,
            result: task.result,
            index: me.store.getCount() + 1,
            requestConfig: {},
            status: 'waiting',
            taskDetail: {
                rate: 0,
                requireType: 'multi'
            },
            idArray: []
        });
        me.showMenu();
    },
    /**
     * 更新任务状态
     */
    updateTaskStatus: function (task) {
        var me = this;
        var store = me.store;
        var taskId = task.taskId;
        var status = task.status;
        var record = store.findRecord('taskId', taskId);
        record.set('taskDetail', {
            rate: task.rate,
            visibility: true,
            requireType: 'multi'
        });
        record.set('status', status);
        console.log(record);
    },
    /**
     * 批量启动任务
     */
    bathStart: function (task) {

    },
})
