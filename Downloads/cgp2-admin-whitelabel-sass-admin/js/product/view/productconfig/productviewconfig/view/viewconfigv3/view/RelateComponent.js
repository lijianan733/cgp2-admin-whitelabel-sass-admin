/**
 * Created by nan on 2021/6/3
 */
Ext.Loader.syncRequire([]);
Ext.define("CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.RelateComponent", {
    extend: "Ext.ux.form.field.UxFieldContainer",
    alias: 'widget.relatecomponent',
    rawData: null,
    initComponent: function () {
        var me = this;
        me.items = [];
        me.callParent();
    },
    isValid: function () {
        var me = this;
        var diyComponentFieldSet = me.items.items[0];
        return diyComponentFieldSet.isValid();

    },
    getErrors: function () {
        return '该配置必须完备';

    },
    getFieldLabel: function () {
        return '内嵌组件配置';
    },
    diyGetValue: function () {
        var me = this;
        var data = me.getValue();
        /*      var componentId = data.relateComponent._id;
              for (var i = 0; i < window.componentArr.length; i++) {
                  if (window.componentArr[i]._id == componentId) {
                      window.componentArr[i] = data.relateComponent;
                  }
              }*/
        return data.relateComponent;
    },
    diySetValue: function (data) {
        var me = this;
        //把id换成具体数据
        var componentId = data._id;
        for (var i = 0; i < window.componentArr.length; i++) {
            if (window.componentArr[i]._id == componentId) {
                me.rawData = window.componentArr[i];
                if (me.rendered == true && me.items.items[0]) {
                    var diyComponentFieldSet = me.items.items[0];
                    diyComponentFieldSet.show();
                    diyComponentFieldSet.refreshData(me.rawData);
                } else {
                    me.on('afterrender', function () {
                        var diyComponentFieldSet = me.items.items[0];
                        if (diyComponentFieldSet.rendered == true) {
                            diyComponentFieldSet.show();
                            diyComponentFieldSet.refreshData(me.rawData);
                        } else {
                            diyComponentFieldSet.on('afterrender', function () {
                                diyComponentFieldSet.show();
                                diyComponentFieldSet.refreshData(me.rawData);
                                setTimeout(function () {
                                    diyComponentFieldSet.setTitle('<font color="green">组件Id:' + me.rawData._id + '</font>');
                                }, 500)
                            })
                        }
                    })
                }
                break;
            }
        }
    },
    listeners: {
        afterrender: function () {
            var me = this;
            me.suspendLayouts();
            me.add({
                xtype: 'diycomponentfieldset',
                margin: '10 0 30 0',
                style: {
                    borderRadius: '8px'
                },
                title: '<font color="green">内嵌组件</font>',
                allowSelectComponent: true,
                width: 600,
                defaults: {
                    width: 550,
                    margin: '5 25 10 25',
                    labelWidth: 120,
                    allowBlank: true,
                },
                allowDelete: false,
                getName: function () {
                    return 'relateComponent'
                },
            });
            me.resumeLayouts();
            me.doLayout();
        }
    }
})