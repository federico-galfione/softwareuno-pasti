String.prototype.makeComparable = function(){
    return String(this).trim().toLowerCase().replace(/\s+/g, ' ');
}

String.prototype.firstCharUppercase = function(){
    return String(this).charAt(0).toUpperCase() + String(this).slice(1);
}