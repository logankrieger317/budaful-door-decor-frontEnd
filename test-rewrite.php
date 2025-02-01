<?php
echo "<h2>Apache Module Check</h2>";
if(in_array('mod_rewrite', apache_get_modules())) {
    echo "mod_rewrite is enabled";
} else {
    echo "mod_rewrite is NOT enabled";
}
?>
