/**
 * ActionLog
 * @Author: miao
 * @Date: 2021/12/30
 */
Ext.define("CGP.returnorder.view.state.ActionLog", {
    extend: "Ext.grid.Panel",
    alias: 'widget.actionlog',
    autoScroll: false,
    scroll: 'vertical',
    entityId: null,

    initComponent: function () {
        var me = this;
        me.store = Ext.create("CGP.returnorder.store.StateInstance", {
            entityId: me.entityId
        });
        me.store.sort([{
            property: 'step',
            direction: 'DESC'
        }]);
        me.columns = [
            {
                xtype: 'componentcolumn',
                sortable: false,
                dataIndex: '_id',
                width: '60%',
                renderer: function (value, metadata, rec, rowIndex) {
                    var his, history = rec.data;
                    his = '(' + (history.step + 1) + ')&nbsp;&nbsp;<font color=red>' + (history.user?.firstName||history.user?.emailAddress) + '</font>' + '于' + '<font color=red>' + (Ext.isEmpty(history.createdDate) ? '' : Ext.Date.format(history.createdDate, 'Y/m/d H:i')) + '</font>' + '将此退货单状态修改为' + '<font color=red>' + history.state?.name + '</font>';
                    if (!Ext.isEmpty(history.remark)) {
                        his += '<spand style="color:red">[' + history.remark + ']<font/>'
                    }
                    // if (!Ext.isEmpty(history.entityClazz) && !Ext.isEmpty(history.entityId)) {
                    //     his += '<a style="color: blue" onclick="' + me.checkEntity(history.entityClazz, history.entityId) + '">查看额外信息</a>'
                    // }
                    his = '<p>' + his + '</p>'
                    return {
                        xtype: 'displayfield',
                        value: his
                    };
                }
            },
            {
                xtype: 'componentcolumn',
                sortable: false,
                dataIndex: 'entityId',
                width: '40%',
                renderer: function (value, metadata, rec, rowIndex) {
                    var entityClazz = rec.get('entityClazz');
                    if (value && !Ext.isEmpty(entityClazz) && rec.get('step') > 0) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" id="click-check" style="color: blue">查看额外信息</a>',
                            listeners: {
                                render: function (display) {
                                    var clickElement = document.getElementById('click-check');
                                    clickElement.addEventListener('click', function () {
                                        var name = entityClazz.substr(entityClazz.lastIndexOf('.') + 1)
                                        Ext.create('Ext.ux.window.SuperWindow', {
                                            width: rec.get('step') == 0 ? 850 : 450,
                                            title: name,
                                            isView: true,
                                            items: [
                                                Ext.create('CGP.returnorder.view.state.entity.' + name + 'Form',
                                                    {
                                                        entityId: value,
                                                        entity:rec.get('entity'),
                                                        border: 0,
                                                        isView:true
                                                    }
                                                )
                                            ]
                                        }).show();
                                    }, false);

                                }
                            }
                        };
                    } else {
                        return null;
                    }
                }
            }
        ];
        me.callParent(arguments);
    }
});