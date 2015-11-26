# stacklog

stacklog is a generic wrapper for logging modules that allows you to add  log
state to nested callbacks. It came about from a project that I recently  shipped
that required very detailed logging to debug. By "stacking" up logging prefixes,
I was able to trace the application flow. The downside of this approach is that
it requires discipline during development--each function entry must be logged. I
used a few snippets in Vim to automate the process.

Note: stacklog does not pass the log prefix stack out of normal closure scope.
If your code calls out to another module or function, it will log accordingly.
A totally contrived example is below:

    info: [FakeApp][run] User requested 123
    info: [DAL][get] 123
    info: [DAL][get][onGet] 123 retrieved
    info: [FakeApp][run][onGetWidget] returning widget 123, name 'Foo'

Performance implications? Yes. _Not_ logging at all performs much better (as
expected). Short of using [dTrace](http://dtrace.org/), this is an unavoidable
penalty that any logging solution will have to incur. The upside is that running
stacklog at less verbose log levels (as you would in normal production
operation) performs better than leaving console.log() statements in.

If you find this useful, or you have a better way of accomplishing the same
task, I would love to hear it!

@jdslatts on twitter or [Justin.Slatterymlssoccer.com](mailto:Justin.Slattery@mlssoccer.com)

## Example

_Code_

    var winston = require('winston')
    , StackLog = require('stacklog')
    , log = (new StackLog(winston))('FakeApp')
    ;

    ;(function run() {
      log.info();

      log.info(null,'Logging an object with winston', {...Complex Object...})

      var l = log.info('run', 'I want a pony!');

      process.nextTick(function(){
        l.error('No!');
      });
    })();

_Output_

    info: [FakeApp]
    info: [FakeApp] Logging an object with winston { Object Stringified }
    info: [FakeApp][run] I want a pony!
    error: [FakeApp][run] No!

## Installation

    $ npm install stacklog

## How to use

Other than the minimal example above, stacklog is best used when abstracted
away from your app in a local module. This will allow you to set up your
preferred logger with appropriate config and then call it throughout your
application. See examples/fakeapp.js and example/winston.js for a more realistic
use case. To run the example (which uses
[Winston](https://github.com/flatiron/winston)):

    npm install winston
    node examples/fakeapp.js

## Options

By default, stacklog will wrap all stack entries in \[square\] brackets.
To change to a different delimiter, pass an options object to the constructor:

    new StackLog(logger, {bd: '(', ed: ')'});

## Performance

Tests were run on core i7 2012 Macbook Air w/ 8GB ram. Average over 100 runs of
1000 iterations. There was zero sciences involved in this experiment.

Test - average (microseconds)

* nolog.js - 1.8
* console.js - 22041.17
* winston.js - 45438.45
* stacklogon.js - 77842.35
* stacklogoff.js - 14706.28

## License

(The MIT License)

Copyright (c) 2013 Justin Slattery (Justin.Slattery@majorleaguesoccer.com) and
Major League Soccer, LLC.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


## Gir
                              :/::-.`                                        
                            .o-```.:+o++//-                                  
                           ++`````--------/o++:`                             
                         .o.````.-------------:++/:---------.`               
                        ++````.-------------------+oo+++++//+oso/:.          
              ://o:   `s-````-----------------------:oo-       `-:+o+.--`    
            -+/::shy:-s````.-------:++++/:-------------+o:           +/:/o`  
           /+::::hhhhy````-----:+++/:::::+++:------------/s-          .::/`  
          o/::::ohhhh+``.----/o+::::::::::::+o:------------+o`               
         o/::::+dhhhd.`.---:o+::::::::::::::::s:------------:s/              
        +/::::/hhhhhs`----/o::::::::::::::::::/y-------------:ss`            
       -+::::/hhhhhh.----/o::::::::::::::::::::m+-----------/oooh-           
       o::::+hhhhhy.-----s::::::::::::::::::::sho---------:/oooooy/          
      .o:::shhhhho`-----:o:::::::::::::::::::odd/--------:+oooooooy/         
      .o/ohhhhhy:`.-----:s:::::::::::::::::/yhho--------/oooooooooy/         
       `------y-``-------o+::::::::::::::/shhh+-------:+ooooooooy+`          
              y``.:oo+:---/o/:::::::::/oyhhhs:-------/ooooooooys.            
              y``-y.o.+o----/ossooosyhhhhyo:-------:+ooooooosy-              
              y``++-/`-Nh------/+osssoo/:--------:/ooooooooy:                
              o-`-sNmhNMMo----------------------/+oooooooy+                  
              `y`.-NMMMMMm--------------------/+oooooooyo`                   
               :+`/MMMMMMh------------------/+oooooooyo`                     
                :o.smNNds:---------------:/+oooooooyo.                       
                 .o/-------------------:/+oooooooy+`                         
                   .+o:-------------:/+oooooooss/`                           
                      :+o+:-----://+oooooooys+.                              
                         `:/+osyssoossyysohdo/`                              
                               `.----.`    ./sds/.                           
                                             .:oymho/:///`                   
                                         `-`+-:sh:-o-:::/s                   
                                        .o+ooos:/s/s:++:+s                   
                                        +h/:yho+/:s/sooyd`                   
                                            .s.:/ooss+yoy                    
                                            /+-////o+soh`                    
                                      `://o+.s/:--:/oyo`                     
                                   .+++:s/.   .//+y/:`                       
                                  /+.-/y-      :o+h                          
                                  y`-:oy+     //--os/`                       
                                  //+oysy`    //.-:+oys+-                    
                                               /+/++oyso:                    
                                                  `.`                        
