package com.devmatch.backend.exception;

public class SameStatusException extends IllegalArgumentException {

  public SameStatusException(String message) {
    super(message);
  }
}
