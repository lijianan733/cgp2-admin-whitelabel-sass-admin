/**
 * Created by nan on 2018/1/29.
 * 添加指定行数，且超出指定行数通过showContext()配置自定义展示数据形式
 * 页面的store已经作为一个全局变量-window.store,
 * valueField配置指定当数组中的数据是对象类型时，指定对象中的一个字段为展示数据
 */
Ext.syncRequire(['Ext.ux.data.proxy.PagingMemoryProxy']);//导入本地分页专用的proxy
Ext.define('CGP.mailhistory.view.DiyArrayColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.diyarraycolumn',
    maxLineCount: null,//控制显示多少行,数值
    renderer: false,
    deleteren: false,
    delimiter: ',',
    valueField: false,
    lineNumber: 1,
    initComponent: function () {
        var me = this,
            renderer,
            listeners;
        window.store = this.isContained.ownerCt.store;//获取到grid的store
        window.showContext = me.showContext;//把该方法变成全局方法
        if (!Ext.isEmpty(me.maxLineCount) && !isNaN(me.maxLineCount)) {//不为空，且不为非数值
            if (me.maxLineCount >= 1) {
                me.maxLineCount = Math.floor(me.maxLineCount);//向下取整
            } else {
                me.maxLineCount = null;
            }
        }
        if (me.header != null) {
            me.text = me.header;
            me.header = null;
        }

        if (!me.triStateSort) {
            me.possibleSortStates.length = 2;
        }
        if (me.columns != null) {
            me.isGroupHeader = true;
            if (me.dataIndex) {
                Ext.Error.raise('Ext.grid.column.Column: Group header may not accept a dataIndex');
            }
            if ((me.width && me.width !== Ext.grid.header.Container.prototype.defaultWidth) || me.flex) {
                Ext.Error.raise('Ext.grid.column.Column: Group header does not support setting explicit widths or flexs. The group header width is calculated by the sum of its children.');
            }
            me.items = me.columns;
            me.columns = me.flex = me.width = null;
            me.cls = (me.cls || '') + ' ' + me.groupHeaderCls;

            me.sortable = me.resizable = false;
            me.align = 'center';
        } else {
            if (me.flex) {
                me.minWidth = me.minWidth || Ext.grid.plugin.HeaderResizer.prototype.minColWidth;
            }
        }
        me.addCls(Ext.baseCSSPrefix + 'column-header-align-' + me.align);


        me.deleteren = me.renderer;
        function uxrender(v, metadata, record) {
            var id = record.getId();
            if (v.length > 0 && Object.prototype.toString.call(v) === '[object Array]') {
                var returnvalue = [];
                for (var i = 0; i < v.length; i++) {
                    var value1 = null;
                    if ((typeof v[i] == 'object') && v[i].constructor == Object) {
                        if (me.valueField) {
                            value1 = v[i][me.valueField];
                        } else if (me.deleteren) {
                            value1 = me.deleteren(v[i], record);
                        } else {
                            if (v[i].id != null) value1 = v[i].id;
                            else {
                                Ext.Msg.alert('message', "Didn't define the display field");
                            }
                        }
                    } else {
                        value1 = v[i];
                    }

                    if (i / me.lineNumber > 0 && i % me.lineNumber == 0) {
                        value1 = "<br>" + value1;
                    }
                    returnvalue.push(value1);
                    if (!Ext.isEmpty(me.maxLineCount)) {
                        if (i == me.lineNumber * (me.maxLineCount) - 1 && v.length > me.lineNumber * me.maxLineCount) {
                            value1 = '<br>' + new Ext.Template('<a href="javascript:{handler}">' + 'More...' + '</a>').apply({
                                handler: "showContext(" + id + ",'" + me.text + "')"
                            });
                            returnvalue.push(value1)
                            break;
                        }
                    }
                }
                return returnvalue.join(me.delimiter);
            } else {
                var value2 = null;
                if ((typeof v == 'object') && v.constructor == Object) {
                    if (me.valueField) {
                        value2 = v[me.valueField];
                    } else if (me.deleteren) {
                        value2 = me.deleteren(v);
                    } else {
                        if (v.id != null) value2 = v.id;
                        else {
                            Ext.Msg.alert('message', "Didn't define the display field");
                        }
                    }
                } else {
                    value2 = v;
                }
                return value2;
            }
        };
        me.renderer = uxrender;

        renderer = me.renderer;
        if (renderer) {
            if (typeof renderer == 'string') {
                me.renderer = Ext.util.Format[renderer];
            }
            me.hasCustomRenderer = true;
        } else if (me.defaultRenderer) {
            me.scope = me;
            me.renderer = me.defaultRenderer;
        }
        me.callParent(arguments);

        listeners = {
            element: me.clickTargetName,
            click: me.onTitleElClick,
            contextmenu: me.onTitleElContextMenu,
            mouseenter: me.onTitleMouseOver,
            mouseleave: me.onTitleMouseOut,
            scope: me
        };
        if (me.resizable) {
            listeners.dblclick = me.onTitleElDblClick;
        }
        me.on(listeners);
    },
    /**
     *  页面的
     * @param id 当前记录的id
     * @param title 创建窗口的名称
     */
    showContext: function (id, title) {
        var store = window.store;
        var record = store.findRecord('_id', id);
        var context = record.get('to');
        var data = [];
        for (var i = 0; i < context.length; i++) {
            data.push({
                email: context[i]
            })
        }
        var diyStore = Ext.create('Ext.data.Store',
            {
                fields: [
                    {
                        name: 'email',
                        type: 'string'
                    }
                ],
                pageSize: 25,
                data: data,
                proxy: {
                    type: 'pagingmemory', // 指定使用PagingMemoryProxy控制读取内存数据,需要导入对应的类Ext.ux.data.proxy.PagingMemoryProxy
                    root: 'data'
                },
                autoLoad: true
            });
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('check') + title,
            height: 400,
            width: 400,
            layout: 'fit',
            items: {
                xtype: 'grid',
                header: false,
                width: 300,
                store: diyStore,
                viewConfig: {
                    enableTextSelection: true,//设置grid中的文本可以选择
                    stripeRows: true//列用颜色区分
                },
                dockedItems: [
                    {
                        xtype: 'pagingtoolbar',
                        store: diyStore,
                        dock: 'bottom',
                        displayInfo: false
                    }
                ],
                columns: [
                    {
                        xtype: 'rownumberer',
                        align: 'center',
                        width: 70
                    },
                    {
                        dataIndex: 'email',
                        text: i18n.getKey('email'),
                        width: 290
                    }
                ]

            }
        }).show();
    }
});