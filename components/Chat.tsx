import { useEffect, useState } from 'react'
import { Button } from './Button'
import { Message, ChatLine, LoadingChatLine } from './ChatLine'
import { useCookies } from 'react-cookie'
// @ts-ignore
import annyang from 'annyang';

// Types and constants here...

export function Chat() {
  // States and variables here...

  useEffect(() => {
    if (!cookie[COOKIE_NAME]) {
      // generate a semi random short id
      const randomId = Math.random().toString(36).substring(7)
      setCookie(COOKIE_NAME, randomId)
    }

    // Voice to text conversion
    if (annyang) {
      annyang.addCallback('result', function(phrases) {
        setInput(phrases[0]);
      });

      annyang.addCallback('start', function() {
        setListening(true);
      });

      annyang.addCallback('end', function() {
        setListening(false);
      });

      annyang.addCallback('error', function() {
        console.error("There was an error with annyang!");
      });

      annyang.setLanguage('es-ES');
    }
  }, [cookie, setCookie])

  const start = () => {
    if (annyang) {
      annyang.start();
    }
  }

  const stop = () => {
    if (annyang) {
      annyang.abort();
    }
  }

  // Remaining functions and return statement...
}
