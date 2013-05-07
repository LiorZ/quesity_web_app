#! /bin/bash
echo "Starting node server on test mode"
cd ..
node app.js --mode test_local >& /dev/null &
node_process_id=$!
echo "Erasing all quests and pages, to start over fresh..."
mongo quesity-test --eval 'db.quests.remove()' >& /dev/null
mongo quesity-test --eval 'db.pages.remove()' >& /dev/null
cd tests
sleep 2
casperjs test --pre=main_site/opening.js main_site/home_screen.js editor/editor.js
kill $node_process_id
