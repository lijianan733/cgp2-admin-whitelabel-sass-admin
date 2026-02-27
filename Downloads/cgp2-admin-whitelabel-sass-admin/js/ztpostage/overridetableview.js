Ext.define('NestedGrid.overrides.view.Table', {
    override: 'Ext.view.Table',
    checkThatContextIsParentGridView: function (e) {
        var target = Ext.get(e.target);
        var parentGridView = target.up('.x-grid-view');
        return !(!parentGridView || this.el.id != parentGridView.id);
    },
    processItemEvent: function (record, row, rowIndex, e) {
        if (e.target && !this.checkThatContextIsParentGridView(e)) {
            return false;
        } else {
            return this.callParent([record, row, rowIndex, e]);
        }
    }
});