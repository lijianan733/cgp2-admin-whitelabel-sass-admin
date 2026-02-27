/**
 * DittoButton
 * @Author: miao
 * @Date: 2022/3/30
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.DittoButton", {
    extend: 'Ext.button.Button',
    alias: 'widget.dittobtn',
    tooltip: '同上',
    text: '同上',
    width: 24,
    margin: '0 2 0 2',
    grid: null,
    componentCls: 'btnOnlyIconV2',
    iconCls: 'icon_copyCmpTitleInfo',
    handler: function (btn) {
        var grid = btn.grid;
        if(Ext.isEmpty(grid)){
            return false;
        }
        var editor = btn.ownerCt.items.items[0];
        var rowIndex = Number(editor.itemId.split('_')[0]);
        var colIndex = Number(editor.itemId.split('_')[1]);
        var upRowIndex;//上一条记录的编号
        var currentRowIndex = grid.rowIndexArr.indexOf(rowIndex);
        upRowIndex = grid.rowIndexArr[currentRowIndex - 1];
        var upEditor = grid.query('[itemId=' + (upRowIndex + '_' + colIndex) + ']')[0];
        if (upEditor) {
            var data = '';
            if (upEditor.diyGetValue) {
                data = upEditor.diyGetValue()
            } else {
                data = upEditor.getValue()
            }
            data = Ext.clone(data);
            if (editor.diySetValue) {
                editor.diySetValue(data);
            } else {
                editor.setValue(data);
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
});