Ext.syncRequire([
    'CGP.common.typesettingschedule.view.LineContainer',
    'CGP.common.typesettingschedule.controller.Controller'
])
Ext.define('CGP.common.typesettingschedule.view.OptionalConfigContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.optionalconfigcontainerv2',
    layout: 'vbox',
    name: null,
    state: null,//expand or collage
    title: null,
    status: null,
    endTime: null,
    titleFn: null,
    switchFn: null,
    startTime: null,
    subTasksItem: null,
    containerItems: null,
    containerConfig: null,
    detailBtnConfig: null,
    lineShow: true,
    allowBlank: true,
    isTimeShow: true,
    initExpand: true,//初始化后是否展开
    errorInfoShow: false,
    getValue: function () {
        var me = this;
        var container = me.getComponent('container');
        var toolbar = me.getComponent('templateConfigToolBar');
        var switchBtn = toolbar.getComponent('switchBtn');
        if (switchBtn.count % 2) {
            return null;
        } else {
            var result = container.getValue();
            return result;
        }
    },
    setValue: function (data) {
        var me = this;
        var container = me.getComponent('container');
        if (data) {
            var toolbar = me.getComponent('templateConfigToolBar');
            var switchBtn = toolbar.getComponent('switchBtn');
            switchBtn.count = 1;
            switchBtn.handler();
            container.setValue(data);
        }
    },
    isValid: function () {
        var me = this;
        var container = me.getComponent('container');
        return container.isValid();
    },
    getName: function () {
        return this.name;
    },
    getErrors: function () {
        var me = this;
        return '该输入项不允许为空'
    },
    getFieldLabel: function () {
        return this.title;
    },
    initComponent: function () {
        var me = this,
            color = {
                FINISHED: 'green',
                FAILURE: '#DC143C',
                RUNNING: '#1D7DA7',
                WAITING: '#999999'
            },
            errorInfo = null,
            relatedInfo = [],
            title, minute, second, hour, takeTime, time, errorMessage,
            startTimeText = me.startTime ? `${me.startTime}` : '',
            endTimeText = me.endTime ? `~&nbsp&nbsp${me.endTime}` : '',
            controller = Ext.create('CGP.common.typesettingschedule.controller.Controller');

        me.color = color[me.status]; //color[me.status]
        title = "<font style= 'color:" + me.color + ";font-weight: bold'>" + i18n.getKey(me.title) + '</font>';
        time = startTimeText + endTimeText;
        takeTime = JSGetTakeTime(me.startTime, me.endTime)

        if (!time) {
            takeTime = '';
            time = '未查询到信息';
        }

        if (me.subTasksItem) {
            var datas = me.subTasksItem['datas'];
            var exception = datas['exception'] ? datas['exception'] : null;
            exception && exception['errorParams'] && (errorInfo = datas['exception']['errorParams']['message']);
            (exception && !exception['errorParams']) && (errorInfo = exception['message']);
            for (var item in datas) {
                (item !== 'exception') && relatedInfo.push({fieldLabel: item, value: datas[item]});
            }
        }

        me.items = [
            {
                xtype: 'toolbar',
                color: 'black',
                maxWidth: 1000,
                bodyStyle: 'border-color:white;',
                border: '0 0 0 0',
                itemId: 'templateConfigToolBar',
                items: [
                    {
                        xtype: 'line_container',
                        itemId: 'lineContainer',
                        indexEnd: false,
                        height: 30,
                        hidden: !me.lineShow,
                        margin: '0 0 0 0'
                    },
                    {
                        xtype: 'button',
                        itemId: 'switchBtn',
                        iconCls: me.initExpand ? 'icon_spread' : 'icon_pack',
                        hidden: !me.allowBlank,
                        componentCls: 'btnOnlyIcon',
                        count: me.initExpand ? 0 : 1,
                        handler: me.switchFn || function () {
                            var btn = this;
                            var toolbar = this.ownerCt;
                            var outContainer = toolbar.ownerCt;
                            var container = outContainer.getComponent('container');
                            if (btn.count % 2) {
                                container.setDisabled(false);
                                container.show();
                                btn.setIconCls('icon_spread');
                            } else {
                                container.setDisabled(true);
                                container.hide();
                                btn.setIconCls('icon_pack');
                            }
                            btn.count++;
                        },
                        listeners: {
                            afterrender: function (comp) {
                                var me = comp.ownerCt.ownerCt;
                                var container = me.getComponent('container');
                                var items = container.items.items;
                                !items.length && comp.setVisible(false);
                            }
                        }
                    },
                    Ext.Object.merge({
                        xtype: 'button',
                        componentCls: "btnOnlyIcon",
                        iconCls: 'icon_detail',
                        margin: '10 10 0 0',
                        hidden: true,
                        tooltip: i18n.getKey('跳转至'),
                        handler: function (btn) {
                            console.log(1);
                        }
                    }, me.detailBtnConfig),
                    {
                        xtype: 'atag_displayfield',
                        fieldCls: 'x-form-display-field',
                        value: title,
                        tooltip: title,
                        clickHandler: me.titleFn || function () {
                            var toolbar = this.ownerCt;
                            var outContainer = toolbar.ownerCt;
                            var btn = toolbar.getComponent('switchBtn');
                            var container = outContainer.getComponent('container');
                            if (btn.count % 2) {
                                container.setDisabled(false);
                                container.show();
                                btn.setIconCls('icon_spread');
                            } else {
                                container.setDisabled(true);
                                container.hide();
                                btn.setIconCls('icon_pack');
                            }
                            btn.count++;
                        }
                    },
                    /* {
                         xtype: 'button',
                         text: title,
                         componentCls: "btnOnlyIcon",
                         handler: me.titleFn || function () {
                             var toolbar = this.ownerCt;
                             var outContainer = toolbar.ownerCt;
                             var btn = toolbar.getComponent('switchBtn');
                             var container = outContainer.getComponent('container');
                             if (btn.count % 2) {
                                 container.setDisabled(false);
                                 container.show();
                                 btn.setIconCls('icon_spread');
                             } else {
                                 container.setDisabled(true);
                                 container.hide();
                                 btn.setIconCls('icon_pack');
                             }
                             btn.count++;
                         },
                     },*/
                    {
                        xtype: 'button',
                        itemId: 'timeText',
                        hidden: !me.isTimeShow,
                        componentCls: "btnOnlyIcon",
                        text: JSCreateFont('gray', true, `用时: ${takeTime}`),
                        tooltip: JSCreateHTMLTable([
                            {
                                title: i18n.getKey('执行时间'),
                                value: time
                            },
                            {
                                title: i18n.getKey('用时'),
                                value: takeTime
                            }
                        ], 'right'),
                    },
                    {
                        xtype: 'button',
                        itemId: 'errorInfo',
                        hidden: me.errorInfoShow ? (me.status !== 'FAILURE') : true,
                        iconCls: 'icon_errorInfo',
                        componentCls: "btnOnlyIcon",
                        tooltip: me.subTasksItem ? '点击查看错误信息' : '未查询到错误信息',
                        handler: function (btn) {
                            me.subTasksItem && Ext.create('Ext.window.Window', {
                                modal: true,
                                width: 700,
                                title: i18n.getKey('check') + '_' + i18n.getKey('错误信息'),
                                items: [
                                    {
                                        xtype: 'uxfieldcontainer',
                                        margin: '5 10 5 10',
                                        defaults: {
                                            xtype: 'displayfield',
                                            labelWidth: 80,
                                            allowBlank: true,
                                        },
                                        items: [
                                            {
                                                fieldLabel: i18n.getKey('失败时间'),
                                                value: startTimeText,
                                            },
                                            {
                                                xtype: 'displayfield',
                                                readOnly: true,
                                                autoScroll: true,
                                                width: 500,
                                                fieldStyle: {border: 'none'},
                                                fieldLabel: i18n.getKey('错误信息'),
                                                value: errorInfo,
                                            },
                                            {
                                                xtype: 'uxfieldcontainer',
                                                fieldLabel: i18n.getKey('相关参数'),
                                                defaults: {
                                                    xtype: 'displayfield',
                                                    labelWidth: 160,
                                                    width: 500,
                                                    allowBlank: true,
                                                    margin: '0 0 0 80'
                                                },
                                                items: relatedInfo
                                            },
                                        ]
                                    }
                                ]
                            }).show()
                        }
                    }
                ]
            },
            Ext.Object.merge({
                xtype: 'container',
                itemId: 'container',
                name: 'container',
                width: '100%',
                disabled: !me.initExpand,
                hidden: !me.initExpand,
                layout: 'vbox',
                items: me.containerItems,
            }, me.containerConfig)
        ];
        me.callParent();
    }
})
