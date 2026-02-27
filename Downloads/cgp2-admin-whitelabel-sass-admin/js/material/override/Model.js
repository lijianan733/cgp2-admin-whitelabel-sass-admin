Ext.define('CGP.material.override.Model', {
    override: 'Ext.data.Model',
    // fixes the issue where null newId doesn't use me.internalId to copy the record using its existing ID
    copy: function(newId) {
        var me = this;
        return new me.self(me.raw, newId || me.internalId, null, Ext.apply({}, me[me.persistenceProperty]));
    }
});