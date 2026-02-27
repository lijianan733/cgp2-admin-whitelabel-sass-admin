/**
 * Created by nan on 2021/4/2
 */
Ext.define('CGP.common.condition.view.MultiAttributePicker', {
    extend: 'Ext.form.field.Picker',
    gridConfig: null,
    alias: 'widget.multiattributepicker',
    createPicker: function () {
        var me = this,
            picker;
        picker = Ext.create('Ext.grid.Panel', Ext.Object.merge({
                shrinkWrapDock: 2,
                pickerField: me,
                floating: true,
                autoScroll: true,
                shadow: false,
                listeners: {
                    celldblclick: function (gridView, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                        var grid = gridView.ownerCt;
                        if (grid.pickerField) {
                            var attribute = record.get('displayName');
                            var result = grid.pickerField.getValue();
                            result += ' {' + attribute + '} ';
                            grid.pickerField.setValue(result);
                        }
                    }
                },
                columns: [
                    {
                        flex: 1,
                        text: i18n.getKey('上下文属性'),
                        dataIndex: 'displayName',
                        renderer: function (value, matedata, record) {
                            matedata.tdAttr = 'data-qtip="双击属性添加到表达式中"';
                            return value;
                        }
                    }
                ]

            }, me.gridConfig)
        )
        return picker;
    }
})
